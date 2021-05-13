module github.com/fluxcd/webui

go 1.16

require (
	github.com/fluxcd/helm-controller/api v0.10.1
	github.com/fluxcd/kustomize-controller/api v0.12.0
	github.com/fluxcd/notification-controller/api v0.13.0
	github.com/fluxcd/pkg/apis/meta v0.9.0
	github.com/fluxcd/pkg/runtime v0.11.0
	github.com/fluxcd/source-controller/api v0.12.2
	github.com/go-logr/logr v0.4.0
	github.com/golang/protobuf v1.4.3
	github.com/onsi/ginkgo v1.14.1
	github.com/onsi/gomega v1.10.2
	github.com/prometheus/client_golang v1.7.1
	github.com/twitchtv/twirp v7.1.0+incompatible
	google.golang.org/protobuf v1.25.0
	k8s.io/api v0.20.4
	k8s.io/apimachinery v0.20.4
	k8s.io/client-go v0.20.4
	sigs.k8s.io/controller-runtime v0.8.3
)
