package clustersserver

import (
	helmv2 "github.com/fluxcd/helm-controller/api/v2beta1"
	kustomizev1 "github.com/fluxcd/kustomize-controller/api/v1beta1"
	sourcev1 "github.com/fluxcd/source-controller/api/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
)

type reconcilable interface {
	runtime.Object
	GetAnnotations() map[string]string
	SetAnnotations(map[string]string)
	GetStatusConditions() *[]metav1.Condition
	GetLastHandledReconcileRequest() string
	DeepCopyObject() runtime.Object

	asRuntimeObject() runtime.Object
}

type apiType struct {
	kind, humanKind string
}

type reconcileWrapper struct {
	apiType
	object reconcilable
}

type gitRepositoryAdapter struct {
	*sourcev1.GitRepository
}

func (o gitRepositoryAdapter) GetLastHandledReconcileRequest() string {
	return o.Status.GetLastHandledReconcileRequest()
}

func (o gitRepositoryAdapter) asRuntimeObject() runtime.Object {
	return o.GitRepository
}

type bucketAdapter struct {
	*sourcev1.Bucket
}

func (obj bucketAdapter) GetLastHandledReconcileRequest() string {
	return obj.Status.GetLastHandledReconcileRequest()
}

func (obj bucketAdapter) asRuntimeObject() runtime.Object {
	return obj
}

type helmReleaseAdapter struct {
	*helmv2.HelmRelease
}

func (obj helmReleaseAdapter) GetLastHandledReconcileRequest() string {
	return obj.Status.GetLastHandledReconcileRequest()
}

func (obj helmReleaseAdapter) asRuntimeObject() runtime.Object {
	return obj.HelmRelease
}

type helmChartAdapter struct {
	*sourcev1.HelmChart
}

func (obj helmChartAdapter) GetLastHandledReconcileRequest() string {
	return obj.Status.GetLastHandledReconcileRequest()
}

func (obj helmChartAdapter) asRuntimeObject() runtime.Object {
	return obj.HelmChart
}

type kustomizationAdapter struct {
	*kustomizev1.Kustomization
}

func (o kustomizationAdapter) GetLastHandledReconcileRequest() string {
	return o.Status.GetLastHandledReconcileRequest()
}

func (o kustomizationAdapter) asRuntimeObject() runtime.Object {
	return o.Kustomization
}
