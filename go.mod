module github.com/fluxcd/webui

go 1.15

require (
	github.com/fluxcd/helm-controller/api v0.4.2
	github.com/fluxcd/kustomize-controller/api v0.4.0
	github.com/fluxcd/notification-controller/api v0.4.0
	github.com/fluxcd/pkg/apis/meta v0.5.0
	github.com/fluxcd/pkg/runtime v0.3.1
	github.com/fluxcd/source-controller/api v0.5.0
	github.com/golang/protobuf v1.4.3
	github.com/prometheus/client_golang v1.7.1
	github.com/shurcooL/httpfs v0.0.0-20190707220628-8d4bc4ba7749 // indirect
	github.com/shurcooL/vfsgen v0.0.0-20200824052919-0d455de96546 // indirect
	github.com/twitchtv/twirp v7.1.0+incompatible
	golang.org/x/net v0.0.0-20200707034311-ab3426394381
	google.golang.org/protobuf v1.25.0
	k8s.io/api v0.19.4
	k8s.io/apimachinery v0.19.4
	k8s.io/client-go v0.19.3
	sigs.k8s.io/controller-runtime v0.6.4
)
