package clustersserver

import (
	helmv2 "github.com/fluxcd/helm-controller/api/v2beta1"
	imageautomationv1 "github.com/fluxcd/image-automation-controller/api/v1beta1"
	imagereflectorv1 "github.com/fluxcd/image-reflector-controller/api/v1beta1"
	kustomizev1 "github.com/fluxcd/kustomize-controller/api/v1beta1"
	notificationv1 "github.com/fluxcd/notification-controller/api/v1beta1"
	sourcev1 "github.com/fluxcd/source-controller/api/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

type reconcilable interface {
	client.Object
	GetAnnotations() map[string]string
	SetAnnotations(map[string]string)
	GetStatusConditions() *[]metav1.Condition
	GetLastHandledReconcileRequest() string
	asClientObject() client.Object
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

func (o gitRepositoryAdapter) asClientObject() client.Object {
	return o.GitRepository
}

type bucketAdapter struct {
	*sourcev1.Bucket
}

func (obj bucketAdapter) GetLastHandledReconcileRequest() string {
	return obj.Status.GetLastHandledReconcileRequest()
}

func (obj bucketAdapter) asClientObject() client.Object {
	return obj
}

type helmReleaseAdapter struct {
	*helmv2.HelmRelease
}

func (obj helmReleaseAdapter) GetLastHandledReconcileRequest() string {
	return obj.Status.GetLastHandledReconcileRequest()
}

func (obj helmReleaseAdapter) asClientObject() client.Object {
	return obj.HelmRelease
}

type helmChartAdapter struct {
	*sourcev1.HelmChart
}

func (obj helmChartAdapter) GetLastHandledReconcileRequest() string {
	return obj.Status.GetLastHandledReconcileRequest()
}

func (obj helmChartAdapter) asClientObject() client.Object {
	return obj.HelmChart
}

type kustomizationAdapter struct {
	*kustomizev1.Kustomization
}

func (o kustomizationAdapter) GetLastHandledReconcileRequest() string {
	return o.Status.GetLastHandledReconcileRequest()
}

func (o kustomizationAdapter) asClientObject() client.Object {
	return o.Kustomization
}

type alertAdapter struct {
	*notificationv1.Alert
}

func (o alertAdapter) asClientObject() client.Object {
	return o.Alert
}

type providerAdapter struct {
	*notificationv1.Provider
}

func (o providerAdapter) asClientObject() client.Object {
	return o.Provider
}

type receiverAdapter struct {
	*notificationv1.Receiver
}

func (o receiverAdapter) asClientObject() client.Object {
	return o.Receiver
}

type imagePolicyAdapter struct {
	*imagereflectorv1.ImagePolicy
}

func (o imagePolicyAdapter) asClientObject() client.Object {
	return o.ImagePolicy
}

type imageRepositoryAdapter struct {
	*imagereflectorv1.ImageRepository
}

func (o imageRepositoryAdapter) GetLastHandledReconcileRequest() string {
	return o.Status.GetLastHandledReconcileRequest()
}

func (o imageRepositoryAdapter) asClientObject() client.Object {
	return o.ImageRepository
}

type imageUpdateAutomationAdapter struct {
	*imageautomationv1.ImageUpdateAutomation
}

func (o imageUpdateAutomationAdapter) GetLastHandledReconcileRequest() string {
	return o.Status.GetLastHandledReconcileRequest()
}

func (o imageUpdateAutomationAdapter) asClientObject() client.Object {
	return o.ImageUpdateAutomation
}
