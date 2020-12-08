package main

import (
	"net/http"
	"os"

	"github.com/fluxcd/pkg/runtime/logger"
	"github.com/fluxcd/webui/pkg/assets"
	"github.com/fluxcd/webui/pkg/clustersserver"
	clustersRpc "github.com/fluxcd/webui/pkg/rpc/clusters"
	"k8s.io/client-go/tools/clientcmd"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func init() {
	var durations = prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "http_request_duration_seconds",
		Help:    "HTTP request durations",
		Buckets: prometheus.DefBuckets,
	}, []string{"service", "method", "status"})

	prometheus.MustRegister(durations)
}

func main() {
	log := logger.NewLogger("debug", false)

	mux := http.NewServeMux()

	clientCfg, err := clientcmd.NewDefaultClientConfigLoadingRules().Load()
	if err != nil {
		log.Error(err, "could not get kubeconfig")
		os.Exit(1)
	}

	mux.Handle("/metrics/", promhttp.Handler())

	mux.Handle("/health/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	clusters := clustersserver.Server{ClientConfig: clientCfg}
	clustersHandler := clustersRpc.NewClustersServer(&clusters, nil)
	mux.Handle("/api/clusters/", http.StripPrefix("/api/clusters", clustersHandler))

	mux.Handle("/", http.FileServer(assets.Assets))

	log.Info("Serving on port 9000")

	if err := http.ListenAndServe(":9000", mux); err != nil {
		log.Error(err, "server exited")
		os.Exit(1)
	}
}
