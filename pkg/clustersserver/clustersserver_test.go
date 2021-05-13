package clustersserver_test

import (
	"context"
	"errors"

	helmv2 "github.com/fluxcd/helm-controller/api/v2beta1"
	kustomizev1 "github.com/fluxcd/kustomize-controller/api/v1beta1"
	sourcev1 "github.com/fluxcd/source-controller/api/v1beta1"
	pb "github.com/fluxcd/webui/pkg/rpc/clusters"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/ginkgo/extensions/table"
	. "github.com/onsi/gomega"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

var _ = Describe("clustersserver", func() {

	It("ListContexts", func() {
		ctxs, err := c.ListContexts(context.Background(), &pb.ListContextsReq{})

		Expect(err).NotTo(HaveOccurred())

		Expect(len(ctxs.Contexts)).To(Equal(1))

		Expect(ctxs.Contexts[0].Name).To(Equal(testClustername))

	})

	It("ListKustomizations", func() {
		name := "my-kustomization"
		ks := &kustomizev1.Kustomization{
			ObjectMeta: metav1.ObjectMeta{
				Name:      name,
				Namespace: "default",
			},
			Spec: kustomizev1.KustomizationSpec{
				SourceRef: kustomizev1.CrossNamespaceSourceReference{
					Kind: "GitRepository",
				},
			},
		}

		err = testclient.Create(context.Background(), ks)

		Expect(err).NotTo(HaveOccurred())

		k, err := c.ListKustomizations(context.Background(), &pb.ListKustomizationsReq{ContextName: testClustername})

		Expect(err).NotTo(HaveOccurred())

		Expect(k.Kustomizations[0].Name).To(Equal(name))

	})

	It("ListHelmReleases", func() {
		name := "my-helmrelease"

		hr := &helmv2.HelmRelease{
			ObjectMeta: metav1.ObjectMeta{
				Name:      name,
				Namespace: "default",
			},
			Spec: helmv2.HelmReleaseSpec{
				Chart: helmv2.HelmChartTemplate{
					Spec: helmv2.HelmChartTemplateSpec{
						SourceRef: helmv2.CrossNamespaceObjectReference{
							Name: name,
						},
					},
				},
			},
		}

		err = testclient.Create(context.Background(), hr)

		Expect(err).NotTo(HaveOccurred())

		res, err := c.ListHelmReleases(context.Background(), &pb.ListHelmReleasesReq{})

		Expect(err).NotTo(HaveOccurred())

		Expect(len(res.HelmReleases)).To(Equal(1))

	})
	DescribeTable("ListSources", func(sourceType pb.Source_Type) {
		k8sObj, err := getPopulatedSourceType(sourceType)

		Expect(err).NotTo(HaveOccurred())

		err = testclient.Create(context.Background(), k8sObj)

		Expect(err).NotTo(HaveOccurred())

		res, err := c.ListSources(context.Background(), &pb.ListSourcesReq{
			SourceType: sourceType,
		})

		Expect(err).NotTo(HaveOccurred())

		Expect(len(res.Sources)).To(Equal(1))

	},
		Entry("git repo", pb.Source_Git),
		Entry("bucket", pb.Source_Bucket),
		Entry("helm release", pb.Source_Helm),
	)
	It("ListEvents", func() {
		e := &corev1.Event{ObjectMeta: metav1.ObjectMeta{
			Name:      "my-event",
			Namespace: "default",
		}}

		err = testclient.Create(context.Background(), e)
		Expect(err).NotTo(HaveOccurred())

		res, err := c.ListEvents(context.Background(), &pb.ListEventsReq{})

		Expect(err).NotTo(HaveOccurred())

		Expect(len(res.Events)).To(Equal(1))
	})

})

func getPopulatedSourceType(sourceType pb.Source_Type) (client.Object, error) {
	objMeta := metav1.ObjectMeta{Name: "somename", Namespace: "default"}

	switch sourceType {
	case pb.Source_Git:
		return &sourcev1.GitRepository{
			ObjectMeta: objMeta,
			Spec: sourcev1.GitRepositorySpec{
				URL:       "ssh://git@github.com/someorg/myproj",
				Reference: &sourcev1.GitRepositoryRef{},
			},
		}, nil

	case pb.Source_Bucket:
		return &sourcev1.Bucket{ObjectMeta: objMeta}, nil

	case pb.Source_Helm:
		return &sourcev1.HelmRepository{ObjectMeta: objMeta}, nil

	case pb.Source_Chart:
		return &sourcev1.HelmChart{}, nil
	}

	return nil, errors.New("could not find source type")
}
