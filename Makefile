.PHONY: clean all test assets dev proto download-crd-deps
SOURCE_VERSION := v0.11.0
KUSTOMIZE_VERSION := v0.11.0
HELM_CRD_VERSION := v0.9.0

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
	curl -s https://raw.githubusercontent.com/fluxcd/source-controller/${SOURCE_VERSION}/config/crd/bases/source.toolkit.fluxcd.io_gitrepositories.yaml > tools/crd/gitrepository.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/source-controller/${SOURCE_VERSION}/config/crd/bases/source.toolkit.fluxcd.io_buckets.yaml > tools/crd/bucket.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/kustomize-controller/${KUSTOMIZE_VERSION}/config/crd/bases/kustomize.toolkit.fluxcd.io_kustomizations.yaml > tools/crd/kustomization.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/helm-controller/${HELM_CRD_VERSION}/config/crd/bases/helm.toolkit.fluxcd.io_helmreleases.yaml > tools/crd/helmrelease.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/source-controller/${SOURCE_VERSION}/config/crd/bases/source.toolkit.fluxcd.io_helmrepositories.yaml > tools/crd/helmrepository.yaml
