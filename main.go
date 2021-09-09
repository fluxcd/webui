package main

import (
	"embed"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"

	"github.com/fluxcd/pkg/runtime/logger"
	"github.com/fluxcd/webui/pkg/clustersserver"
	"github.com/go-logr/logr"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	_ "k8s.io/client-go/plugin/pkg/client/auth"
	"k8s.io/client-go/tools/clientcmd"
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

	for contextName := range rules.Contexts {
		contexts = append(contexts, contextName)
	}

	return contexts, rules.CurrentContext, nil
}

func main() {
	log := logger.NewLogger(logger.Options{LogLevel: "debug"})

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

	clusters := clustersserver.NewServer(kubeContexts, currentKubeContext)

	mux.Handle("/api/clusters/", http.StripPrefix("/api/clusters", clusters))

	assetFS := getAssets()
	assetHandler := http.FileServer(http.FS(assetFS))
	redirector := createRedirector(assetFS, log)

	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		extension := filepath.Ext(req.URL.Path)
		// We use the golang http.FileServer for static file requests.
		// This will return a 404 on normal page requests, ie /kustomizations and /sources.
		// Redirect all non-file requests to index.html, where the JS routing will take over.
		if extension == "" {
			redirector(w, req)
			return
		}
		assetHandler.ServeHTTP(w, req)
	}))

	log.Info("Serving on port 9000")

	if err := http.ListenAndServe(":9000", mux); err != nil {
		log.Error(err, "server exited")
		os.Exit(1)
	}
}

//go:embed dist/*
var static embed.FS

func getAssets() fs.FS {
	f, err := fs.Sub(static, "dist")

	if err != nil {
		panic(err)
	}
	return f
}

func createRedirector(fsys fs.FS, log logr.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		indexPage, err := fsys.Open("index.html")

		if err != nil {
			log.Error(err, "could not open index.html page")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		stat, err := indexPage.Stat()
		if err != nil {
			log.Error(err, "could not get index.html stat")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		bt := make([]byte, stat.Size())
		_, err = indexPage.Read(bt)

		if err != nil {
			log.Error(err, "could not read index.html")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		_, err = w.Write(bt)

		if err != nil {
			log.Error(err, "error writing index.html")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}
