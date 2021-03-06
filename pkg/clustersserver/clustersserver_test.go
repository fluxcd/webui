package clustersserver_test

import (
	"context"

	helmv2 "github.com/fluxcd/helm-controller/api/v2beta1"
	kustomizev1 "github.com/fluxcd/kustomize-controller/api/v1beta1"
	pb "github.com/fluxcd/webui/pkg/rpc/clusters"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
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

})
