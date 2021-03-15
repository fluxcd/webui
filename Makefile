UPTODATE := .uptodate

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
