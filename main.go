package main

import (
	"context"
	"net/http"
	"os"

	"github.com/bboreham/kspan/controllers/events"
	"github.com/fluxcd/pkg/runtime/logger"
	"github.com/fluxcd/webui/pkg/assets"
	"github.com/fluxcd/webui/pkg/clustersserver"
	"github.com/go-logr/logr"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/exporters/otlp"
	"go.opentelemetry.io/otel/propagators"
	tracesdk "go.opentelemetry.io/otel/sdk/export/trace"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/tools/clientcmd"
	ctrl "sigs.k8s.io/controller-runtime"
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

func setupOTLP(collectorAddr, serviceName string) (tracesdk.SpanExporter, error) {
	exp, err := otlp.NewExporter(
		otlp.WithInsecure(),
		otlp.WithAddress(collectorAddr),
	)
	if err != nil {
		return nil, err
	}
	global.SetTextMapPropagator(propagators.TraceContext{})
	return exp, err
}

func initializeKspan(log logr.Logger) {
	mgr, err := ctrl.NewManager(ctrl.GetConfigOrDie(), ctrl.Options{
		Scheme:             runtime.NewScheme(),
		MetricsBindAddress: ":8080",
		Port:               9443,
	})

	if err != nil {
		log.Error(err, "unable to set up controller manager")
		os.Exit(1)
	}

	spanExporter, err := setupOTLP("otlp-collector.default:55680", "events")
	if err != nil {
		log.Error(err, "unable to set up tracing")
		os.Exit(1)
	}
	defer spanExporter.Shutdown(context.Background())

	(&events.EventWatcher{
		Client:   mgr.GetClient(),
		Log:      ctrl.Log,
		Exporter: spanExporter,
	}).SetupWithManager(mgr)
}

func main() {
	log := logger.NewLogger("debug", false)

	mux := http.NewServeMux()

	initializeKspan(log)

	mux.Handle("/metrics/", promhttp.Handler())

	mux.Handle("/health/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	kubeContexts, currentKubeContext, err := initialContexts()

	if err != nil {
		log.Error(err, "could not get k8s contexts")
		os.Exit(1)
	}

	clusters := clustersserver.NewServer(kubeContexts, currentKubeContext)

	mux.Handle("/api/clusters/", http.StripPrefix("/api/clusters", clusters))

	mux.Handle("/", http.FileServer(assets.Assets))

	log.Info("Serving on port 9000")

	if err := http.ListenAndServe(":9000", mux); err != nil {
		log.Error(err, "server exited")
		os.Exit(1)
	}
}
