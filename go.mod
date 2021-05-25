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
	github.com/kr/text v0.2.0 // indirect
	github.com/niemeyer/pretty v0.0.0-20200227124842-a10e7caefd8e // indirect
	github.com/onsi/ginkgo v1.14.2
	github.com/onsi/gomega v1.10.2
	github.com/prometheus/client_golang v1.7.1
	github.com/twitchtv/twirp v7.1.0+incompatible
	golang.org/x/tools v0.0.0-20200916195026-c9a70fc28ce3 // indirect
	google.golang.org/protobuf v1.25.0
	gopkg.in/check.v1 v1.0.0-20200227125254-8fa46927fb4f // indirect
	k8s.io/api v0.20.4
	k8s.io/apimachinery v0.20.4
	k8s.io/client-go v0.20.4
	sigs.k8s.io/controller-runtime v0.8.3
	sigs.k8s.io/kustomize/kstatus v0.0.2
)
