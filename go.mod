module github.com/fluxcd/webui

go 1.16

require (
	github.com/fluxcd/helm-controller/api v0.10.1
	github.com/fluxcd/image-automation-controller/api v0.17.1
	github.com/fluxcd/image-reflector-controller/api v0.13.2
	github.com/fluxcd/kustomize-controller/api v0.12.2
	github.com/fluxcd/notification-controller/api v0.18.1
	github.com/fluxcd/pkg/apis/meta v0.10.0
	github.com/fluxcd/pkg/runtime v0.11.0
	github.com/fluxcd/source-controller/api v0.17.2
	github.com/go-logr/logr v0.4.0
	github.com/onsi/ginkgo v1.16.4
	github.com/onsi/gomega v1.14.0
	github.com/prometheus/client_golang v1.11.0
	github.com/twitchtv/twirp v8.1.0+incompatible
	golang.org/x/crypto v0.0.0-20210421170649-83a5a9bb288b // indirect
	google.golang.org/protobuf v1.26.0
	gopkg.in/check.v1 v1.0.0-20201130134442-10cb98267c6c // indirect
	k8s.io/api v0.21.3
	k8s.io/apimachinery v0.21.3
	k8s.io/client-go v0.21.3
	sigs.k8s.io/controller-runtime v0.9.5
	sigs.k8s.io/kustomize/kstatus v0.0.2
)
