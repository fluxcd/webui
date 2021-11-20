package clustersserver

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"

	helmv2 "github.com/fluxcd/helm-controller/api/v2beta1"
	imageautomationv1 "github.com/fluxcd/image-automation-controller/api/v1beta1"
	imagereflectorv1 "github.com/fluxcd/image-reflector-controller/api/v1beta1"
	kustomizev1 "github.com/fluxcd/kustomize-controller/api/v1beta1"
	notificationv1 "github.com/fluxcd/notification-controller/api/v1beta1"
	"github.com/fluxcd/pkg/apis/meta"
	sourcev1 "github.com/fluxcd/source-controller/api/v1beta1"
	pb "github.com/fluxcd/webui/pkg/rpc/clusters"
	"github.com/fluxcd/webui/pkg/util"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/wait"

	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/kustomize/kstatus/status"

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

func mapCrossNamespaceObjectReference(conditions []notificationv1.CrossNamespaceObjectReference) []*pb.CrossNamespaceObjectReference {
	out := []*pb.CrossNamespaceObjectReference{}

	for _, cnor := range conditions {
		out = append(out, &pb.CrossNamespaceObjectReference{
			ApiVersion: cnor.APIVersion,
			Kind:       cnor.Kind,
			Name:       cnor.Name,
			Namespace:  cnor.Namespace,
		})
	}

	return out
}

func mapConditions(conditions []metav1.Condition) []*pb.Condition {
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

func doReconcileAnnotations(annotations map[string]string) {
	if annotations == nil {
		annotations = map[string]string{
			meta.ReconcileAtAnnotation: time.Now().Format(time.RFC3339Nano),
		}
	} else {
		annotations[meta.ReconcileAtAnnotation] = time.Now().Format(time.RFC3339Nano)
	}
}

func addSnapshots(out []*pb.GroupVersionKind, collection []schema.GroupVersionKind) []*pb.GroupVersionKind {
	for _, gvk := range collection {
		out = append(out, &pb.GroupVersionKind{
			Group:   gvk.Group,
			Version: gvk.Version,
			Kind:    gvk.Kind,
		})
	}

	return out
}

func convertKustomization(kustomization kustomizev1.Kustomization, namespace string) (*pb.Kustomization, error) {
	reconcileRequestAt := kustomization.Annotations[meta.ReconcileRequestAnnotation]
	reconcileAt := kustomization.Annotations[meta.ReconcileAtAnnotation]

	k := &pb.Kustomization{
		Name:                  kustomization.Name,
		Namespace:             kustomization.Namespace,
		TargetNamespace:       kustomization.Spec.TargetNamespace,
		Path:                  kustomization.Spec.Path,
		SourceRef:             kustomization.Spec.SourceRef.Name,
		SourceRefKind:         getSourceTypeEnum(kustomization.Spec.SourceRef.Kind),
		Conditions:            mapConditions(kustomization.Status.Conditions),
		Interval:              kustomization.Spec.Interval.Duration.String(),
		Prune:                 kustomization.Spec.Prune,
		ReconcileRequestAt:    reconcileRequestAt,
		ReconcileAt:           reconcileAt,
		Snapshots:             []*pb.SnapshotEntry{},
		LastAppliedRevision:   kustomization.Status.LastAppliedRevision,
		LastAttemptedRevision: kustomization.Status.LastAttemptedRevision,
	}
	kinds := []*pb.GroupVersionKind{}

	// The current test environment does not append a Snapshot,
	// so check for it here. Should only be nil in tests.
	if kustomization.Status.Snapshot != nil {
		for ns, gvks := range kustomization.Status.Snapshot.NamespacedKinds() {
			kinds = addSnapshots(kinds, gvks)

			k.Snapshots = append(k.Snapshots, &pb.SnapshotEntry{
				Namespace: ns,
				Kinds:     kinds,
			})
		}

		for _, gvk := range kustomization.Status.Snapshot.NonNamespacedKinds() {
			kinds = addSnapshots(kinds, []schema.GroupVersionKind{gvk})

			k.Snapshots = append(k.Snapshots, &pb.SnapshotEntry{
				Namespace: "",
				Kinds:     kinds,
			})
		}
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
		m, err := convertKustomization(kustomization, msg.Namespace)
		if err != nil {
			return nil, err
		}

		k = append(k, m)
	}

	return &pb.ListKustomizationsRes{Kustomizations: k}, nil

}

const KustomizeNameKey string = "kustomize.toolkit.fluxcd.io/name"
const KustomizeNamespaceKey string = "kustomize.toolkit.fluxcd.io/namespace"

func (s *Server) GetReconciledObjects(ctx context.Context, msg *pb.GetReconciledObjectsReq) (*pb.GetReconciledObjectsRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	result := []unstructured.Unstructured{}

	for _, gvk := range msg.Kinds {
		list := unstructured.UnstructuredList{}

		list.SetGroupVersionKind(schema.GroupVersionKind{
			Group:   gvk.Group,
			Kind:    gvk.Kind,
			Version: gvk.Version,
		})

		opts := client.MatchingLabels{
			KustomizeNameKey:      msg.KustomizationName,
			KustomizeNamespaceKey: msg.KustomizationNamespace,
		}

		if err := c.List(ctx, &list, opts); err != nil {
			return nil, fmt.Errorf("could not get unstructured list: %s\n", err)
		}

		result = append(result, list.Items...)

	}

	objects := []*pb.UnstructuredObject{}
	for _, obj := range result {
		res, err := status.Compute(&obj)

		if err != nil {
			return nil, fmt.Errorf("could not get status for %s: %w", obj.GetName(), err)
		}

		objects = append(objects, &pb.UnstructuredObject{
			GroupVersionKind: &pb.GroupVersionKind{
				Group:   obj.GetObjectKind().GroupVersionKind().Group,
				Version: obj.GetObjectKind().GroupVersionKind().GroupVersion().Version,
				Kind:    obj.GetKind(),
			},
			Name:      obj.GetName(),
			Namespace: obj.GetNamespace(),
			Status:    res.Status.String(),
			Uid:       string(obj.GetUID()),
		})
	}
	return &pb.GetReconciledObjectsRes{Objects: objects}, nil
}

func (s *Server) GetChildObjects(ctx context.Context, msg *pb.GetChildObjectsReq) (*pb.GetChildObjectsRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	list := unstructured.UnstructuredList{}

	list.SetGroupVersionKind(schema.GroupVersionKind{
		Group:   msg.GroupVersionKind.Group,
		Version: msg.GroupVersionKind.Version,
		Kind:    msg.GroupVersionKind.Kind,
	})

	if err := c.List(ctx, &list, namespaceOpts("default")); err != nil {
		return nil, fmt.Errorf("could not get unstructured object: %s\n", err)
	}

	objects := []*pb.UnstructuredObject{}

Items:
	for _, obj := range list.Items {

		refs := obj.GetOwnerReferences()

		for _, ref := range refs {
			if ref.UID != types.UID(msg.ParentUid) {
				// This is not the child we are looking for.
				// Skip the rest of the operations in the outer loop
				continue Items
			}
		}

		res, err := status.Compute(&obj)

		if err != nil {
			return nil, fmt.Errorf("could not get status for %s: %w", obj.GetName(), err)
		}
		objects = append(objects, &pb.UnstructuredObject{
			GroupVersionKind: &pb.GroupVersionKind{
				Group:   obj.GetObjectKind().GroupVersionKind().Group,
				Version: obj.GetObjectKind().GroupVersionKind().GroupVersion().Version,
				Kind:    obj.GetKind(),
			},
			Name:      obj.GetName(),
			Namespace: obj.GetNamespace(),
			Status:    res.Status.String(),
			Uid:       string(obj.GetUID()),
		})
	}

	return &pb.GetChildObjectsRes{Objects: objects}, nil
}

func kindToSourceType(kind string) pb.Source_Type {
	switch kind {
	case "Git":
		return pb.Source_Git
	case "Bucket":
		return pb.Source_Bucket

	case "HelmRelease":
		return pb.Source_Helm

	case "HelmChart":
		return pb.Source_Chart
	}

	return -1
}

func getSourceType(sourceType pb.Source_Type) (client.ObjectList, *reconcileWrapper, error) {
	switch sourceType {
	case pb.Source_Git:
		return &sourcev1.GitRepositoryList{}, &reconcileWrapper{object: gitRepositoryAdapter{&sourcev1.GitRepository{}}}, nil

	case pb.Source_Bucket:
		return &sourcev1.BucketList{}, &reconcileWrapper{object: bucketAdapter{&sourcev1.Bucket{}}}, nil

	case pb.Source_Helm:
		return &sourcev1.HelmRepositoryList{}, &reconcileWrapper{object: helmReleaseAdapter{&helmv2.HelmRelease{}}}, nil

	case pb.Source_Chart:
		return &sourcev1.HelmChartList{}, &reconcileWrapper{object: helmChartAdapter{&sourcev1.HelmChart{}}}, nil
	}

	return nil, nil, errors.New("could not find source type")
}

func appendSources(k8sObj runtime.Object, res *pb.ListSourcesRes) error {
	switch list := k8sObj.(type) {
	case *sourcev1.GitRepositoryList:
		for _, i := range list.Items {
			artifact := i.Status.Artifact
			ref := i.Spec.Reference

			src := pb.Source{
				Name:      i.Name,
				Namespace: i.Namespace,
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
				Name:       i.Name,
				Type:       pb.Source_Helm,
				Url:        i.Spec.URL,
				Timeout:    i.Spec.Timeout.Duration.String(),
				Artifact:   &pb.Artifact{},
				Conditions: mapConditions(i.Status.Conditions),
			}

			if i.Status.Artifact != nil {
				src.Artifact = &pb.Artifact{
					Checksum: i.Status.Artifact.Checksum,
					Path:     i.Status.Artifact.Path,
					Revision: i.Status.Artifact.Revision,
					Url:      i.Status.Artifact.URL,
				}
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

	k8sList, _, err := getSourceType(msg.SourceType)

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

func reconcileSource(ctx context.Context, c client.Client, sourceName, namespace string, obj reconcilable) error {
	name := types.NamespacedName{
		Name:      sourceName,
		Namespace: namespace,
	}

	if err := c.Get(ctx, name, obj.asClientObject()); err != nil {
		return err
	}
	annotations := obj.GetAnnotations()
	doReconcileAnnotations(annotations)

	obj.SetAnnotations(annotations)

	return c.Update(ctx, obj.asClientObject())
}

func checkResourceSync(ctx context.Context, c client.Client, name types.NamespacedName, obj reconcilable, lastReconcile string) func() (bool, error) {
	return func() (bool, error) {
		err := c.Get(ctx, name, obj.asClientObject())
		if err != nil {
			return false, err
		}

		return obj.GetLastHandledReconcileRequest() != lastReconcile, nil
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
		sourceRef := kustomization.Spec.SourceRef

		_, sourceObj, err := getSourceType(kindToSourceType(sourceRef.Kind))

		if err != nil {
			return nil, fmt.Errorf("could not get reconcileable source object: %w", err)
		}

		err = reconcileSource(ctx, client, sourceRef.Name, sourceRef.Namespace, sourceObj.object)

		if err != nil {
			return nil, fmt.Errorf("could not reconcile source: %w", err)
		}
	}

	doReconcileAnnotations(kustomization.Annotations)

	if err := client.Update(ctx, &kustomization); err != nil {
		return nil, fmt.Errorf("could not update kustomization: %w", err)
	}

	if err := wait.PollImmediate(
		k8sPollInterval,
		k8sTimeout,
		checkResourceSync(ctx, client, name, kustomizationAdapter{&kustomizev1.Kustomization{}}, kustomization.Status.LastHandledReconcileAt),
	); err != nil {
		return nil, err
	}

	k, err := convertKustomization(kustomization, msg.Namespace)

	if err != nil {
		return nil, err
	}
	return &pb.SyncKustomizationRes{Kustomization: k}, nil

}

func (s *Server) SyncSource(ctx context.Context, msg *pb.SyncSourceReq) (*pb.SyncSourceRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	_, sourceObj, err := getSourceType(msg.SourceType)

	if err != nil {
		return nil, fmt.Errorf("could not get source type: %w", err)
	}

	if err := reconcileSource(ctx, c, msg.SourceName, msg.Namespace, sourceObj.object); err != nil {
		return nil, fmt.Errorf("could not reconcile source: %w", err)
	}

	name := types.NamespacedName{
		Name:      msg.SourceName,
		Namespace: msg.Namespace,
	}

	if err := wait.PollImmediate(
		k8sPollInterval,
		k8sTimeout,
		checkResourceSync(ctx, c, name, sourceObj.object, sourceObj.object.GetLastHandledReconcileRequest()),
	); err != nil {
		return nil, err
	}

	return &pb.SyncSourceRes{}, nil
}

func convertHelmRelease(hr helmv2.HelmRelease) *pb.HelmRelease {
	spec := hr.Spec
	chartSpec := hr.Spec.Chart.Spec
	return &pb.HelmRelease{
		Name:            hr.Name,
		Namespace:       hr.Namespace,
		Interval:        spec.Interval.Duration.String(),
		ChartName:       chartSpec.Chart,
		Version:         chartSpec.Version,
		SourceKind:      chartSpec.SourceRef.Kind,
		SourceName:      chartSpec.SourceRef.Name,
		SourceNamespace: chartSpec.SourceRef.Namespace,
		Conditions:      mapConditions(hr.Status.Conditions),
	}
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
		res.HelmReleases = append(res.HelmReleases, convertHelmRelease(r))
	}

	return res, nil
}

func (s *Server) SyncHelmRelease(ctx context.Context, msg *pb.SyncHelmReleaseReq) (*pb.SyncHelmReleaseRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	name := types.NamespacedName{
		Name:      msg.HelmReleaseName,
		Namespace: msg.Namespace,
	}
	hr := helmv2.HelmRelease{}

	if err := c.Get(ctx, name, &hr); err != nil {
		return nil, fmt.Errorf("could not get helm release: %w", err)
	}

	doReconcileAnnotations(hr.Annotations)

	if err := c.Update(ctx, &hr); err != nil {
		return nil, fmt.Errorf("could not update kustomization: %w", err)
	}

	if err := wait.PollImmediate(
		k8sPollInterval,
		k8sTimeout,
		checkResourceSync(ctx, c, name, helmReleaseAdapter{&helmv2.HelmRelease{}}, hr.Status.LastHandledReconcileAt),
	); err != nil {
		return nil, err
	}

	return &pb.SyncHelmReleaseRes{Helmrelease: convertHelmRelease(hr)}, nil

}

func convertImagePolicy(ip imagereflectorv1.ImagePolicy) *pb.ImagePolicy {
	var p, pk string
	if ip.Spec.Policy.Alphabetical != nil {
		pk = "Alphabetical"
		p = ip.Spec.Policy.Alphabetical.Order
	} else if ip.Spec.Policy.Numerical != nil {
		pk = "Numerical"
		p = ip.Spec.Policy.Numerical.Order
	} else if ip.Spec.Policy.SemVer != nil {
		pk = "SemVer"
		p = ip.Spec.Policy.SemVer.Range
	}

	var ftp, fte string = "-", "-"
	if ip.Spec.FilterTags != nil {
		if ip.Spec.FilterTags.Pattern != "" {
			ftp = ip.Spec.FilterTags.Pattern
		}
		if ip.Spec.FilterTags.Extract != "" {
			fte = ip.Spec.FilterTags.Extract
		}
	}

	return &pb.ImagePolicy{
		Name:               ip.Name,
		Namespace:          ip.Namespace,
		ImageRepositoryRef: ip.Spec.ImageRepositoryRef.Name,
		PolicyKind:         pk,
		Policy:             p,
		FilterTagsPattern:  ftp,
		FilterTagsExtract:  fte,
		LatestImage:        ip.Status.LatestImage,
		Conditions:         mapConditions(ip.Status.Conditions),
	}
}

func (s *Server) ListImagePolicies(ctx context.Context, msg *pb.ListImagePoliciesReq) (*pb.ListImagePoliciesRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	res := &pb.ListImagePoliciesRes{ImagePolicies: []*pb.ImagePolicy{}}

	list := imagereflectorv1.ImagePolicyList{}

	if err := c.List(ctx, &list, &client.ListOptions{Namespace: msg.Namespace}); err != nil {
		if apierrors.IsNotFound(err) {
			return res, nil
		}

		return nil, fmt.Errorf("could not list image policies: %w", err)
	}

	for _, r := range list.Items {
		res.ImagePolicies = append(res.ImagePolicies, convertImagePolicy(r))
	}

	return res, nil
}

func convertImageRepository(ir imagereflectorv1.ImageRepository) *pb.ImageRepository {
	var t string
	if ir.Spec.Timeout == nil {
		t = "-"
	}
	var sr string
	if ir.Spec.SecretRef != nil {
		sr = ir.Spec.SecretRef.Name
	} else {
		sr = "-"
	}
	var csr string
	if ir.Spec.CertSecretRef != nil {
		csr = ir.Spec.CertSecretRef.Name
	} else {
		csr = "-"
	}
	var tc, st int32
	if ir.Status.LastScanResult != nil {
		tc = int32(ir.Status.LastScanResult.TagCount)
		st = int32(ir.Status.LastScanResult.ScanTime.Unix())
	} else {
		tc, st = 0, 0
	}

	return &pb.ImageRepository{
		Name:                   ir.Name,
		Namespace:              ir.Namespace,
		Image:                  ir.Spec.Image,
		SecretRef:              sr,
		Conditions:             mapConditions(ir.Status.Conditions),
		Interval:               ir.Spec.Interval.Duration.String(),
		Timeout:                t,
		CertSecretRef:          csr,
		Suspend:                ir.Spec.Suspend,
		ReconcileRequestAt:     ir.Annotations[meta.ReconcileRequestAnnotation],
		ReconcileAt:            ir.Annotations[meta.ReconcileAtAnnotation],
		LastScanResultTagCount: tc,
		LastScanResultScanTime: st,
	}
}

func (s *Server) ListImageRepositories(ctx context.Context, msg *pb.ListImageRepositoriesReq) (*pb.ListImageRepositoriesRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	res := &pb.ListImageRepositoriesRes{ImageRepositories: []*pb.ImageRepository{}}

	list := imagereflectorv1.ImageRepositoryList{}

	if err := c.List(ctx, &list, &client.ListOptions{Namespace: msg.Namespace}); err != nil {
		if apierrors.IsNotFound(err) {
			return res, nil
		}

		return nil, fmt.Errorf("could not list image repositories: %w", err)
	}

	for _, r := range list.Items {
		res.ImageRepositories = append(res.ImageRepositories, convertImageRepository(r))
	}

	return res, nil
}

func (s *Server) SyncImageRepository(ctx context.Context, msg *pb.SyncImageRepositoryReq) (*pb.SyncImageRepositoryRes, error) {
	client, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	name := types.NamespacedName{
		Name:      msg.ImageRepositoryName,
		Namespace: msg.Namespace,
	}
	ir := imagereflectorv1.ImageRepository{}

	if err := client.Get(ctx, name, &ir); err != nil {
		return nil, fmt.Errorf("could not get image repository: %w", err)
	}

	doReconcileAnnotations(ir.Annotations)

	if err := client.Update(ctx, &ir); err != nil {
		return nil, fmt.Errorf("could not update image repository: %w", err)
	}

	if err := wait.PollImmediate(
		k8sPollInterval,
		k8sTimeout,
		checkResourceSync(ctx, client, name, imageRepositoryAdapter{&imagereflectorv1.ImageRepository{}}, ir.Status.LastHandledReconcileAt),
	); err != nil {
		return nil, err
	}

	return &pb.SyncImageRepositoryRes{Imagerepository: convertImageRepository(ir)}, nil

}

func convertImageUpdateAutomation(iua imageautomationv1.ImageUpdateAutomation) *pb.ImageUpdateAutomation {
	var lart, lpt int32
	if iua.Status.LastAutomationRunTime != nil {
		lart = int32(iua.Status.LastAutomationRunTime.Unix())
	} else {
		lart = 0
	}
	if iua.Status.LastPushTime != nil {
		lpt = int32(iua.Status.LastPushTime.Unix())
	} else {
		lpt = 0
	}

	return &pb.ImageUpdateAutomation{
		Name:                  iua.Name,
		Namespace:             iua.Namespace,
		SourceRef:             iua.Spec.SourceRef.Name,
		SourceRefKind:         getSourceTypeEnum(iua.Spec.SourceRef.Kind),
		Conditions:            mapConditions(iua.Status.Conditions),
		Interval:              iua.Spec.Interval.Duration.String(),
		UpdatePath:            iua.Spec.Update.Path,
		UpdateStrategy:        string(iua.Spec.Update.Strategy),
		Suspend:               iua.Spec.Suspend,
		ReconcileRequestAt:    iua.Annotations[meta.ReconcileRequestAnnotation],
		ReconcileAt:           iua.Annotations[meta.ReconcileAtAnnotation],
		LastAutomationRunTime: lart,
		LastPushCommit:        iua.Status.LastPushCommit,
		LastPushTime:          lpt,
	}
}

func (s *Server) ListImageUpdateAutomations(ctx context.Context, msg *pb.ListImageUpdateAutomationsReq) (*pb.ListImageUpdateAutomationsRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	res := &pb.ListImageUpdateAutomationsRes{ImageUpdateAutomations: []*pb.ImageUpdateAutomation{}}

	list := imageautomationv1.ImageUpdateAutomationList{}

	if err := c.List(ctx, &list, &client.ListOptions{Namespace: msg.Namespace}); err != nil {
		if apierrors.IsNotFound(err) {
			return res, nil
		}

		return nil, fmt.Errorf("could not list image update automations: %w", err)
	}

	for _, r := range list.Items {
		res.ImageUpdateAutomations = append(res.ImageUpdateAutomations, convertImageUpdateAutomation(r))
	}

	return res, nil
}

func (s *Server) SyncImageUpdateAutomation(ctx context.Context, msg *pb.SyncImageUpdateAutomationReq) (*pb.SyncImageUpdateAutomationRes, error) {
	client, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	name := types.NamespacedName{
		Name:      msg.ImageUpdateAutomationName,
		Namespace: msg.Namespace,
	}
	iua := imageautomationv1.ImageUpdateAutomation{}

	if err := client.Get(ctx, name, &iua); err != nil {
		return nil, fmt.Errorf("could not get image update automation: %w", err)
	}

	doReconcileAnnotations(iua.Annotations)

	if err := client.Update(ctx, &iua); err != nil {
		return nil, fmt.Errorf("could not update image update automation: %w", err)
	}

	if err := wait.PollImmediate(
		k8sPollInterval,
		k8sTimeout,
		checkResourceSync(ctx, client, name, imageUpdateAutomationAdapter{&imageautomationv1.ImageUpdateAutomation{}}, iua.Status.LastHandledReconcileAt),
	); err != nil {
		return nil, err
	}

	return &pb.SyncImageUpdateAutomationRes{Imageupdateautomation: convertImageUpdateAutomation(iua)}, nil

}

func convertAlert(p notificationv1.Alert) *pb.Alert {
	return &pb.Alert{
		Name:          p.Name,
		Namespace:     p.Namespace,
		ProviderRef:   p.Spec.ProviderRef.Name,
		EventSeverity: p.Spec.EventSeverity,
		EventSources:  mapCrossNamespaceObjectReference(p.Spec.EventSources),
		ExclusionList: p.Spec.ExclusionList,
		Summary:       p.Spec.Summary,
		Suspend:       p.Spec.Suspend,
		Conditions:    mapConditions(p.Status.Conditions),
	}
}

func (s *Server) ListAlerts(ctx context.Context, msg *pb.ListAlertsReq) (*pb.ListAlertsRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	res := &pb.ListAlertsRes{Alerts: []*pb.Alert{}}

	list := notificationv1.AlertList{}

	if err := c.List(ctx, &list, &client.ListOptions{Namespace: msg.Namespace}); err != nil {
		if apierrors.IsNotFound(err) {
			return res, nil
		}

		return nil, fmt.Errorf("could not list alerts: %w", err)
	}

	for _, r := range list.Items {
		res.Alerts = append(res.Alerts, convertAlert(r))
	}

	return res, nil
}

func convertProvider(p notificationv1.Provider) *pb.Provider {
	var sr string
	if p.Spec.SecretRef != nil {
		sr = p.Spec.SecretRef.Name
	} else {
		sr = "-"
	}
	var csr string
	if p.Spec.CertSecretRef != nil {
		csr = p.Spec.CertSecretRef.Name
	} else {
		csr = "-"
	}

	return &pb.Provider{
		Name:          p.Name,
		Namespace:     p.Namespace,
		Type:          p.Spec.Type,
		Channel:       p.Spec.Channel,
		Username:      p.Spec.Username,
		Address:       p.Spec.Address,
		Proxy:         p.Spec.Proxy,
		SecretRef:     sr,
		CertSecretRef: csr,
		Conditions:    mapConditions(p.Status.Conditions),
	}
}

func (s *Server) ListProviders(ctx context.Context, msg *pb.ListProvidersReq) (*pb.ListProvidersRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	res := &pb.ListProvidersRes{Providers: []*pb.Provider{}}

	list := notificationv1.ProviderList{}

	if err := c.List(ctx, &list, &client.ListOptions{Namespace: msg.Namespace}); err != nil {
		if apierrors.IsNotFound(err) {
			return res, nil
		}

		return nil, fmt.Errorf("could not list providers: %w", err)
	}

	for _, r := range list.Items {
		res.Providers = append(res.Providers, convertProvider(r))
	}

	return res, nil
}

func convertReceiver(r notificationv1.Receiver) *pb.Receiver {
	return &pb.Receiver{
		Name:       r.Name,
		Namespace:  r.Namespace,
		Type:       r.Spec.Type,
		Events:     r.Spec.Events,
		Resources:  mapCrossNamespaceObjectReference(r.Spec.Resources),
		SecretRef:  r.Spec.SecretRef.Name,
		Suspend:    r.Spec.Suspend,
		Url:        r.Status.URL,
		Conditions: mapConditions(r.Status.Conditions),
	}
}

func (s *Server) ListReceivers(ctx context.Context, msg *pb.ListReceiversReq) (*pb.ListReceiversRes, error) {
	c, err := s.getClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	res := &pb.ListReceiversRes{Receivers: []*pb.Receiver{}}

	list := notificationv1.ReceiverList{}

	if err := c.List(ctx, &list, &client.ListOptions{Namespace: msg.Namespace}); err != nil {
		if apierrors.IsNotFound(err) {
			return res, nil
		}

		return nil, fmt.Errorf("could not list receivers: %w", err)
	}

	for _, r := range list.Items {
		res.Receivers = append(res.Receivers, convertReceiver(r))
	}

	return res, nil
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
