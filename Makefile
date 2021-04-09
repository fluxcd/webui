UPTODATE := .uptodate
SOURCE_VERSION := v0.11.0
KUSTOMIZE_VERSION := v0.11.0
HELM_CRD_VERSION := v0.9.0

$(UPTODATE):
	touch .uptodate

clean:
	rm $(UPTODATE)

all: test build

ui: $(UPTODATE)
	npm run build

test: ui assets
	go test ./...

assets: ui
	go run -tags=generate pkg/assets/generate.go

build: assets
	CGO_ENABLED=0 go build -o ./bin/webui .

dev: assets
	gin -a 9000 -b ./bin/gin-bin

proto-native: pkg/rpc/clusters/clusters.proto
	protoc pkg/rpc/clusters/clusters.proto --twirp_out=./ --go_out=. --twirp_typescript_out=./ui/lib/rpc

download-crd-deps:
	curl -s https://raw.githubusercontent.com/fluxcd/source-controller/${SOURCE_VERSION}/config/crd/bases/source.toolkit.fluxcd.io_gitrepositories.yaml > tools/crd/gitrepository.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/source-controller/${SOURCE_VERSION}/config/crd/bases/source.toolkit.fluxcd.io_buckets.yaml > tools/crd/bucket.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/kustomize-controller/${KUSTOMIZE_VERSION}/config/crd/bases/kustomize.toolkit.fluxcd.io_kustomizations.yaml > tools/crd/kustomization.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/helm-controller/${HELM_CRD_VERSION}/config/crd/bases/helm.toolkit.fluxcd.io_helmreleases.yaml > tools/crd/helmrelease.yaml
	curl -s https://raw.githubusercontent.com/fluxcd/source-controller/${SOURCE_VERSION}/config/crd/bases/source.toolkit.fluxcd.io_helmrepositories.yaml > tools/crd/helmrepository.yaml
