package clustersserver

import (
	"context"

	pb "github.com/fluxcd/webui/pkg/rpc/clusters"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
)

type Server struct {
	ClientConfig *clientcmdapi.Config
}

func (s *Server) ListContexts(ctx context.Context, msg *pb.ListContextsReq) (*pb.ListContextsRes, error) {

	ctxs := []*pb.Context{}
	for _, c := range s.ClientConfig.Contexts {
		ctxs = append(ctxs, &pb.Context{Name: c.Cluster})
	}

	return &pb.ListContextsRes{Contexts: ctxs}, nil
}
