package clustersserver

import (
	"context"
	"fmt"

	"k8s.io/client-go/tools/clientcmd"

	helmv2 "github.com/fluxcd/helm-controller/api/v2beta1"
	kustomizev1 "github.com/fluxcd/kustomize-controller/api/v1beta1"
	notificationv1 "github.com/fluxcd/notification-controller/api/v1beta1"
	sourcev1 "github.com/fluxcd/source-controller/api/v1beta1"
	pb "github.com/fluxcd/webui/pkg/rpc/clusters"
	apiruntime "k8s.io/apimachinery/pkg/runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	rbacv1 "k8s.io/api/rbac/v1"
)

type Server struct {
	LoadingRules *clientcmd.ClientConfigLoadingRules
}

func (s *Server) newKubeClient(kubeContext string) (client.Client, error) {
	configOverrides := clientcmd.ConfigOverrides{CurrentContext: kubeContext}

	restCfg, err := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
		s.LoadingRules,
		&configOverrides,
	).ClientConfig()

	if err != nil {
		return nil, fmt.Errorf("could not create rest config: %w", err)
	}

	scheme := apiruntime.NewScheme()
	_ = appsv1.AddToScheme(scheme)
	_ = corev1.AddToScheme(scheme)
	_ = rbacv1.AddToScheme(scheme)
	_ = sourcev1.AddToScheme(scheme)
	_ = kustomizev1.AddToScheme(scheme)
	_ = helmv2.AddToScheme(scheme)
	_ = notificationv1.AddToScheme(scheme)

	kubeClient, err := client.New(restCfg, client.Options{
		Scheme: scheme,
	})

	if err != nil {
		return nil, fmt.Errorf("kubernetes client initialization failed: %w", err)
	}

	return kubeClient, nil
}

func (s *Server) ListContexts(ctx context.Context, msg *pb.ListContextsReq) (*pb.ListContextsRes, error) {
	cfg, err := s.LoadingRules.Load()

	if err != nil {
		return nil, fmt.Errorf("could not load rules %w", err)
	}

	ctxs := []*pb.Context{}
	for _, c := range cfg.Contexts {
		ctxs = append(ctxs, &pb.Context{Name: c.Cluster})
	}

	return &pb.ListContextsRes{Contexts: ctxs}, nil
}

func (s *Server) ListKustomizations(ctx context.Context, msg *pb.ListKustomizationsReq) (*pb.ListKustomizationsRes, error) {
	client, err := s.newKubeClient(msg.ContextName)

	if err != nil {
		return nil, fmt.Errorf("could not create client: %w", err)
	}

	result := kustomizev1.KustomizationList{}
	if err := client.List(ctx, &result); err != nil {
		return nil, fmt.Errorf("could not list kustomizations: %w", err)
	}

	k := []*pb.Kustomization{}
	for _, kustomization := range result.Items {
		k = append(k, &pb.Kustomization{Name: kustomization.Name})
	}

	return &pb.ListKustomizationsRes{Kustomizations: k}, nil

}
