package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/fluxcd/pkg/runtime/logger"
	"github.com/fluxcd/webui/pkg/assets"

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

	mux.Handle("/metrics/", promhttp.Handler())

	mux.Handle("/api/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		res := &struct {
			Ok bool `json:"ok"`
		}{Ok: true}

		b, err := json.Marshal(res)

		if err != nil {
			log.Error(err, "could not marshal response")
		}

		if _, err := w.Write(b); err != nil {
			log.Error(err, "could not write response")
		}

	}))

	mux.Handle("/", http.FileServer(assets.Assets))

	log.Info("Serving on port 9000")

	if err := http.ListenAndServe(":9000", mux); err != nil {
		log.Error(err, "Server exited")
		os.Exit(1)
	}
}
