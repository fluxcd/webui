package clustersserver

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"

	kustomizev1 "github.com/fluxcd/kustomize-controller/api/v1beta1"
	"github.com/fluxcd/pkg/apis/meta"
	sourcev1 "github.com/fluxcd/source-controller/api/v1beta1"
	pb "github.com/fluxcd/webui/pkg/rpc/clusters"
	"github.com/fluxcd/webui/pkg/util"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/wait"
	"sigs.k8s.io/controller-runtime/pkg/client"

	apierrors "k8s.io/apimachinery/pkg/api/errors"
)

type clientCache map[string]client.Client

var k8sPollInterval = 2 * time.Second
var k8sTimeout = 1 * time.Minute

type Server struct {
	ClientCache       clientCache
	AvailableContexts []string
	InitialContext    string
	CreateClient      func(string) (client.Client, error)
	mu                sync.Mutex
}

func NewServer(kubeContexts []string, currentKubeContext string) http.Handler {
	clusters := Server{
		AvailableContexts: kubeContexts,
		InitialContext:    currentKubeContext,
		ClientCache:       map[string]client.Client{},
		CreateClient:      defaultCreateClient,
	}

	clustersHandler := pb.NewClustersServer(&clusters, nil)

	return clustersHandler
}

func defaultCreateClient(kubeContext string) (client.Client, error) {
	return util.NewKubeClient(kubeContext)
}

func (s *Server) getClient(kubeContext string) (client.Client, error) {
	if s.ClientCache[kubeContext] != nil {
		return s.ClientCache[kubeContext], nil
	}

	s.mu.Lock()

	client, err := s.CreateClient(kubeContext)

	if err != nil {
		return nil, err
	}

	s.ClientCache[kubeContext] = client

	s.mu.Unlock()

	return client, nil
}

func (s *Server) ListContexts(ctx context.Context, msg *pb.ListContextsReq) (*pb.ListContextsRes, error) {
	ctxs := []*pb.Context{}
	for _, c := range s.AvailableContexts {
		ctxs = append(ctxs, &pb.Context{Name: c})
	}

	return &pb.ListContextsRes{Contexts: ctxs, CurrentContext: s.InitialContext}, nil
}

func (s *Server) ListKustomizations(ctx context.Context, msg *pb.ListKustomizationsReq) (*pb.ListKustomizationsRes, error) {
	client, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	result := kustomizev1.KustomizationList{}
	if err := client.List(ctx, &result); err != nil {
		return nil, fmt.Errorf("could not list kustomizations: %w", err)
	}

	k := []*pb.Kustomization{}
	for _, kustomization := range result.Items {

		m := pb.Kustomization{
			Name:            kustomization.Name,
			Namespace:       kustomization.Namespace,
			TargetNamespace: kustomization.Spec.TargetNamespace,
			Path:            kustomization.Spec.Path,
			SourceRef:       kustomization.Spec.SourceRef.Name,
			Conditions:      []*pb.Condition{},
		}

		for _, c := range kustomization.Status.Conditions {
			m.Conditions = append(m.Conditions, &pb.Condition{
				Type:    c.Type,
				Status:  string(c.Status),
				Reason:  c.Reason,
				Message: c.Message,
			})
		}

		k = append(k, &m)
	}

	return &pb.ListKustomizationsRes{Kustomizations: k}, nil

}

func getSourceType(sourceType string) (runtime.Object, error) {
	switch sourceType {
	case "git":
		return &sourcev1.GitRepositoryList{}, nil

	case "bucket":
		return &sourcev1.BucketList{}, nil

	case "helm":
		return &sourcev1.HelmRepositoryList{}, nil
	}

	return nil, errors.New("could not find source type")
}

func appendSources(sourceType string, k8sObj runtime.Object, res *pb.ListSourcesRes) error {
	switch list := k8sObj.(type) {
	case *sourcev1.GitRepositoryList:
		for _, i := range list.Items {
			res.Sources = append(res.Sources, &pb.Source{
				Name: i.Name, Type: pb.Source_Git,
				Url: i.Spec.URL,
				Reference: &pb.GitRepositoryRef{
					Branch: i.Spec.Reference.Branch,
					Tag:    i.Spec.Reference.Tag,
					Semver: i.Spec.Reference.SemVer,
					Commit: i.Spec.Reference.Commit,
				},
			})
		}

	case *sourcev1.BucketList:
		for _, i := range list.Items {
			res.Sources = append(res.Sources, &pb.Source{Name: i.Name})
		}

	case *sourcev1.HelmRepositoryList:
		for _, i := range list.Items {
			res.Sources = append(res.Sources, &pb.Source{Name: i.Name})
		}
	}

	return errors.New("could not append sources; invalid type")
}

func (s *Server) ListSources(ctx context.Context, msg *pb.ListSourcesReq) (*pb.ListSourcesRes, error) {
	client, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}
	res := &pb.ListSourcesRes{Sources: []*pb.Source{}}

	k8sList, err := getSourceType(msg.SourceType)

	if err != nil {
		return nil, fmt.Errorf("could not get source type: %w", err)
	}

	if err := client.List(ctx, k8sList); err != nil {
		if apierrors.IsNotFound(err) {
			return res, nil
		}
		return nil, fmt.Errorf("could not list sources: %w", err)
	}

	appendSources(msg.SourceType, k8sList, res)

	return res, nil
}

type reconcilable interface {
	runtime.Object
	GetAnnotations() map[string]string
	SetAnnotations(map[string]string)
}

func reconcileSource(ctx context.Context, c client.Client, spec kustomizev1.KustomizationSpec, obj reconcilable) error {
	name := types.NamespacedName{
		Name:      spec.SourceRef.Name,
		Namespace: spec.SourceRef.Namespace,
	}

	if err := c.Get(ctx, name, obj); err != nil {
		return err
	}

	if annotations := obj.GetAnnotations(); obj.GetAnnotations() == nil {
		obj.SetAnnotations(map[string]string{
			meta.ReconcileAtAnnotation: time.Now().Format(time.RFC3339Nano),
		})

	} else {
		annotations[meta.ReconcileAtAnnotation] = time.Now().Format(time.RFC3339Nano)
		obj.SetAnnotations(annotations)
	}

	return c.Update(ctx, obj)
}

func checkKustomizationSync(ctx context.Context, c client.Client, name types.NamespacedName, lastReconcile string) func() (bool, error) {
	return func() (bool, error) {
		kustomization := kustomizev1.Kustomization{}
		err := c.Get(ctx, name, &kustomization)
		if err != nil {
			return false, err
		}
		return kustomization.Status.LastHandledReconcileAt != lastReconcile, nil
	}
}

func (s *Server) SyncKustomization(ctx context.Context, msg *pb.SyncKustomizationReq) (*pb.SyncKustomizationRes, error) {
	client, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	name := types.NamespacedName{
		Name:      msg.KustomizationName,
		Namespace: msg.KustomizationNamespace,
	}
	kustomization := kustomizev1.Kustomization{}

	if err := client.Get(ctx, name, &kustomization); err != nil {
		return nil, fmt.Errorf("could not list kustomizations: %w", err)
	}

	if msg.WithSource {
		switch kustomization.Spec.SourceRef.Kind {
		case sourcev1.GitRepositoryKind:
			err = reconcileSource(ctx, client, kustomization.Spec, &sourcev1.GitRepository{})
		case sourcev1.BucketKind:
			err = reconcileSource(ctx, client, kustomization.Spec, &sourcev1.Bucket{})
		}
		if err != nil {
			return nil, fmt.Errorf("could not reconcile source: %w", err)
		}
	}

	if kustomization.Annotations == nil {
		kustomization.Annotations = map[string]string{
			meta.ReconcileAtAnnotation: time.Now().Format(time.RFC3339Nano),
		}
	} else {
		kustomization.Annotations[meta.ReconcileAtAnnotation] = time.Now().Format(time.RFC3339Nano)
	}

	if err := client.Update(ctx, &kustomization); err != nil {
		return nil, fmt.Errorf("could not update kustomization: %w", err)
	}

	if err := wait.PollImmediate(
		k8sPollInterval,
		k8sTimeout,
		checkKustomizationSync(ctx, client, name, kustomization.Status.LastHandledReconcileAt),
	); err != nil {
		return nil, err
	}

	return &pb.SyncKustomizationRes{Ok: true}, nil
}
