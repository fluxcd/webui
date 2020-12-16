package clustersserver_test

import (
	"context"

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

})
