.PHONY: clean all test assets dev proto download-crd-deps
SOURCE_VERSION := v0.17.2
KUSTOMIZE_VERSION := v0.12.2
HELM_CRD_VERSION := v0.10.1
IMAGE_AUTOMATION_CONTROLLER_VERSION := v0.17.1
IMAGE_REFLECTOR_CONTROLLER_VERSION := v0.13.2
NOTIFICATION_CONTROLLER_VERSION := v0.18.1

all: test build

dist/index.html:
	npm run build

test:
	go test ./...

build: dist/index.html
	CGO_ENABLED=0 go build -o ./bin/webui .

dev: dist/index.html
	reflex -r '.go' -s -- sh -c 'go run main.go'

proto: pkg/rpc/clusters/clusters.proto
	protoc pkg/rpc/clusters/clusters.proto --twirp_out=./ --go_out=. --twirp_typescript_out=./ui/lib/rpc

download-crd-deps:
	curl -s https://raw.githubusercontent.com/fluxcd/kustomize-controller/${KUSTOMIZE_VERSION}/config/crd/bases/kustomize.toolkit.fluxcd.io_kustomizations.yaml > tools/crd/kustomization.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/source-controller/${SOURCE_VERSION}/config/crd/bases/source.toolkit.fluxcd.io_gitrepositories.yaml > tools/crd/gitrepository.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/source-controller/${SOURCE_VERSION}/config/crd/bases/source.toolkit.fluxcd.io_buckets.yaml > tools/crd/bucket.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/source-controller/${SOURCE_VERSION}/config/crd/bases/source.toolkit.fluxcd.io_helmrepositories.yaml > tools/crd/helmrepository.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/helm-controller/${HELM_CRD_VERSION}/config/crd/bases/helm.toolkit.fluxcd.io_helmreleases.yaml > tools/crd/helmrelease.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/image-reflector-controller/${IMAGE_REFLECTOR_CONTROLLER_VERSION}/config/crd/bases/image.toolkit.fluxcd.io_imagepolicies.yaml > tools/crd/imagepolicy.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/image-reflector-controller/${IMAGE_REFLECTOR_CONTROLLER_VERSION}/config/crd/bases/image.toolkit.fluxcd.io_imagerepositories.yaml > tools/crd/imagerepository.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/image-automation-controller/${IMAGE_AUTOMATION_CONTROLLER_VERSION}/config/crd/bases/image.toolkit.fluxcd.io_imageupdateautomations.yaml > tools/crd/imageupdateautomation.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/notification-controller/${NOTIFICATION_CONTROLLER_VERSION}/config/crd/bases/notification.toolkit.fluxcd.io_alerts.yaml > tools/crd/alert.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/notification-controller/${NOTIFICATION_CONTROLLER_VERSION}/config/crd/bases/notification.toolkit.fluxcd.io_providers.yaml > tools/crd/provider.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/notification-controller/${NOTIFICATION_CONTROLLER_VERSION}/config/crd/bases/notification.toolkit.fluxcd.io_receivers.yaml > tools/crd/receiver.yaml