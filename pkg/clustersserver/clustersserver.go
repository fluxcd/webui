package clustersserver

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"

	helmv2 "github.com/fluxcd/helm-controller/api/v2beta1"
	kustomizev1 "github.com/fluxcd/kustomize-controller/api/v1beta1"
	"github.com/fluxcd/pkg/apis/meta"
	sourcev1 "github.com/fluxcd/source-controller/api/v1beta1"
	pb "github.com/fluxcd/webui/pkg/rpc/clusters"
	"github.com/fluxcd/webui/pkg/util"
	appsv1 "k8s.io/api/apps/v1"
	apimetav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/wait"
	"sigs.k8s.io/controller-runtime/pkg/client"

	corev1 "k8s.io/api/core/v1"
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
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.ClientCache[kubeContext] != nil {
		return s.ClientCache[kubeContext], nil
	}

	client, err := s.CreateClient(kubeContext)

	if err != nil {
		return nil, err
	}

	s.ClientCache[kubeContext] = client

	return client, nil
}

func (s *Server) ListContexts(ctx context.Context, msg *pb.ListContextsReq) (*pb.ListContextsRes, error) {
	ctxs := []*pb.Context{}
	for _, c := range s.AvailableContexts {
		ctxs = append(ctxs, &pb.Context{Name: c})
	}

	return &pb.ListContextsRes{Contexts: ctxs, CurrentContext: s.InitialContext}, nil
}

func (s *Server) ListNamespacesForContext(ctx context.Context, msg *pb.ListNamespacesForContextReq) (*pb.ListNamespacesForContextRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	result := corev1.NamespaceList{}
	if err := c.List(ctx, &result); err != nil {
		return nil, fmt.Errorf("could not list namespaces: %w", err)
	}

	res := pb.ListNamespacesForContextRes{
		Namespaces: []string{},
	}

	for _, ns := range result.Items {
		res.Namespaces = append(res.Namespaces, ns.Name)
	}

	return &res, nil
}

func namespaceOpts(ns string) *client.ListOptions {
	opts := client.ListOptions{}
	if ns != "" {
		opts.Namespace = ns
	}

	return &opts
}

func getSourceTypeEnum(kind string) pb.Source_Type {
	switch kind {
	case sourcev1.GitRepositoryKind:
		return pb.Source_Git
	}

	return pb.Source_Git
}

func mapConditions(conditions []apimetav1.Condition) []*pb.Condition {
	out := []*pb.Condition{}

	for _, c := range conditions {
		out = append(out, &pb.Condition{
			Type:      c.Type,
			Status:    string(c.Status),
			Reason:    c.Reason,
			Message:   c.Message,
			Timestamp: c.LastTransitionTime.String(),
		})
	}

	return out
}

func convertKustomization(kustomization kustomizev1.Kustomization) (*pb.Kustomization, error) {
	reconcileRequestAt := kustomization.Annotations[meta.ReconcileRequestAnnotation]

	reconcileAt := kustomization.Annotations[meta.ReconcileAtAnnotation]

	k := &pb.Kustomization{
		Name:               kustomization.Name,
		Namespace:          kustomization.Namespace,
		TargetNamespace:    kustomization.Spec.TargetNamespace,
		Path:               kustomization.Spec.Path,
		SourceRef:          kustomization.Spec.SourceRef.Name,
		SourceRefKind:      getSourceTypeEnum(kustomization.Spec.SourceRef.Kind),
		Conditions:         mapConditions(kustomization.Status.Conditions),
		Interval:           kustomization.Spec.Interval.Duration.String(),
		Prune:              kustomization.Spec.Prune,
		ReconcileRequestAt: reconcileRequestAt,
		ReconcileAt:        reconcileAt,
	}

	return k, nil

}

func (s *Server) ListKustomizations(ctx context.Context, msg *pb.ListKustomizationsReq) (*pb.ListKustomizationsRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	result := kustomizev1.KustomizationList{}

	if err := c.List(ctx, &result, namespaceOpts(msg.Namespace)); err != nil {
		return nil, fmt.Errorf("could not list kustomizations: %w", err)
	}

	k := []*pb.Kustomization{}
	for _, kustomization := range result.Items {
		m, err := convertKustomization(kustomization)
		if err != nil {
			return nil, err
		}

		k = append(k, m)
	}

	return &pb.ListKustomizationsRes{Kustomizations: k}, nil

}

func getSourceType(sourceType pb.Source_Type) (runtime.Object, error) {
	switch sourceType {
	case pb.Source_Git:
		return &sourcev1.GitRepositoryList{}, nil

	case pb.Source_Bucket:
		return &sourcev1.BucketList{}, nil

	case pb.Source_Helm:
		return &sourcev1.HelmRepositoryList{}, nil

	case pb.Source_Chart:
		return &sourcev1.HelmChartList{}, nil
	}

	return nil, errors.New("could not find source type")
}

func appendSources(k8sObj runtime.Object, res *pb.ListSourcesRes) error {
	switch list := k8sObj.(type) {
	case *sourcev1.GitRepositoryList:
		for _, i := range list.Items {
			artifact := i.Status.Artifact
			ref := i.Spec.Reference

			src := pb.Source{
				Name:      i.Name,
				Type:      pb.Source_Git,
				Url:       i.Spec.URL,
				Artifact:  &pb.Artifact{},
				Reference: &pb.GitRepositoryRef{},
			}
			if artifact != nil {
				src.Artifact = &pb.Artifact{
					Checksum: artifact.Checksum,
					Path:     artifact.Path,
					Revision: artifact.Revision,
					Url:      artifact.URL,
				}
			}

			if ref != nil {
				src.Reference = &pb.GitRepositoryRef{
					Branch: i.Spec.Reference.Branch,
					Tag:    i.Spec.Reference.Tag,
					Semver: i.Spec.Reference.SemVer,
					Commit: i.Spec.Reference.Commit,
				}
			}

			res.Sources = append(res.Sources, &src)
		}

	case *sourcev1.BucketList:
		for _, i := range list.Items {
			res.Sources = append(res.Sources, &pb.Source{
				Name: i.Name,
				Type: pb.Source_Bucket,
			})
		}

	case *sourcev1.HelmRepositoryList:
		for _, i := range list.Items {
			src := &pb.Source{
				Name:    i.Name,
				Type:    pb.Source_Helm,
				Url:     i.Spec.URL,
				Timeout: i.Spec.Timeout.Duration.String(),
				Artifact: &pb.Artifact{
					Checksum: i.Status.Artifact.Checksum,
					Path:     i.Status.Artifact.Path,
					Revision: i.Status.Artifact.Revision,
					Url:      i.Status.Artifact.URL,
				},
				Conditions: mapConditions(i.Status.Conditions),
			}

			res.Sources = append(res.Sources, src)
		}
	case *sourcev1.HelmChartList:
		for _, i := range list.Items {
			res.Sources = append(res.Sources, &pb.Source{Name: i.Name})
		}
	}

	return nil
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

	if err := client.List(ctx, k8sList, namespaceOpts(msg.Namespace)); err != nil {
		if apierrors.IsNotFound(err) {
			return res, nil
		}
		return nil, fmt.Errorf("could not list sources: %w", err)
	}

	if err := appendSources(k8sList, res); err != nil {
		return nil, fmt.Errorf("could not append source: %w", err)
	}

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
		Namespace: msg.Namespace,
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

	k, err := convertKustomization(kustomization)

	if err != nil {
		return nil, err
	}
	return &pb.SyncKustomizationRes{Kustomization: k}, nil

}

func (s *Server) ListHelmReleases(ctx context.Context, msg *pb.ListHelmReleasesReq) (*pb.ListHelmReleasesRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	res := &pb.ListHelmReleasesRes{HelmReleases: []*pb.HelmRelease{}}

	list := helmv2.HelmReleaseList{}

	if err := c.List(ctx, &list, &client.ListOptions{Namespace: msg.Namespace}); err != nil {
		if apierrors.IsNotFound(err) {
			return res, nil
		}

		return nil, fmt.Errorf("could not list helm releases: %w", err)
	}

	for _, r := range list.Items {
		spec := r.Spec
		chartSpec := r.Spec.Chart.Spec

		res.HelmReleases = append(res.HelmReleases, &pb.HelmRelease{
			Name:            r.Name,
			Namespace:       r.Namespace,
			Interval:        spec.Interval.Duration.String(),
			ChartName:       chartSpec.Chart,
			Version:         chartSpec.Version,
			SourceKind:      chartSpec.SourceRef.Kind,
			SourceName:      chartSpec.SourceRef.Name,
			SourceNamespace: chartSpec.SourceRef.Namespace,
			Conditions:      mapConditions(r.Status.Conditions),
		})
	}

	return res, nil
}

const KustomizationNameLabelKey string = "kustomize.toolkit.fluxcd.io/name"
const KustomizationNamespaceLabelKey string = "kustomize.toolkit.fluxcd.io/namespace"

func (s *Server) ListWorkloads(ctx context.Context, msg *pb.ListWorkloadsReq) (*pb.ListWorkloadsRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	deployments := appsv1.DeploymentList{}

	if err := c.List(ctx, &deployments, namespaceOpts(msg.Namespace)); err != nil {
		return nil, fmt.Errorf("could not get kustomization: %w", err)
	}

	workloads := []*pb.Workload{}

	for _, dep := range deployments.Items {
		kustomizationRefName := dep.Labels[KustomizationNameLabelKey]
		kustomizationRefNamespace := dep.Labels[KustomizationNamespaceLabelKey]

		wl := pb.Workload{
			Name:                      dep.Name,
			Namespace:                 dep.Namespace,
			KustomizationRefName:      kustomizationRefName,
			KustomizationRefNamespace: kustomizationRefNamespace,
			PodTemplate: &pb.PodTemplate{
				Containers: []*pb.Container{},
			},
		}

		for _, c := range dep.Spec.Template.Spec.Containers {
			wl.PodTemplate.Containers = append(wl.PodTemplate.Containers, &pb.Container{
				Name:  c.Name,
				Image: c.Image,
			})
		}

		workloads = append(workloads, &wl)
	}

	return &pb.ListWorkloadsRes{Workloads: workloads}, nil

}

func (s *Server) ListEvents(ctx context.Context, msg *pb.ListEventsReq) (*pb.ListEventsRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	list := corev1.EventList{}
	if err := c.List(ctx, &list, namespaceOpts(msg.Namespace)); err != nil {
		return nil, fmt.Errorf("could not get events: %w", err)
	}

	events := []*pb.Event{}

	for _, e := range list.Items {
		events = append(events, &pb.Event{
			Type:      e.Type,
			Source:    fmt.Sprintf("%s/%s", e.Source.Component, e.ObjectMeta.Name),
			Reason:    e.Reason,
			Message:   e.Message,
			Timestamp: int32(e.LastTimestamp.Unix()),
		})
	}

	return &pb.ListEventsRes{Events: events}, nil
}
