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
	"sigs.k8s.io/controller-runtime/pkg/client"
)

func init() {
	var durations = prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "http_request_duration_seconds",
		Help:    "HTTP request durations",
		Buckets: prometheus.DefBuckets,
	}, []string{"service", "method", "status"})

	prometheus.MustRegister(durations)
}

func initialContexts() (contexts []string, currentCtx string, err error) {
	cfgLoadingRules := clientcmd.NewDefaultClientConfigLoadingRules()

	rules, err := cfgLoadingRules.Load()

	if err != nil {
		return contexts, currentCtx, err
	}

	for _, c := range rules.Contexts {
		contexts = append(contexts, c.Cluster)
	}

	return contexts, rules.CurrentContext, nil
}

func main() {
	log := logger.NewLogger("debug", false)

	mux := http.NewServeMux()

	mux.Handle("/metrics/", promhttp.Handler())

	mux.Handle("/health/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	kubeContexts, currentKubeContext, err := initialContexts()

	if err != nil {
		log.Error(err, "could not get k8s contexts")
		os.Exit(1)
	}

	clusters := clustersserver.Server{
		AvailableContexts: kubeContexts,
		InitialContext:    currentKubeContext,
		ClientCache:       map[string]client.Client{},
	}

	clustersHandler := clustersRpc.NewClustersServer(&clusters, nil)
	mux.Handle("/api/clusters/", http.StripPrefix("/api/clusters", clustersHandler))

	mux.Handle("/", http.FileServer(assets.Assets))

	log.Info("Serving on port 9000")

	if err := http.ListenAndServe(":9000", mux); err != nil {
		log.Error(err, "server exited")
		os.Exit(1)
	}
}
