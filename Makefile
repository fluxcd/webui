all: test build

ui: ui/index.html ui/main.js
	yarn build

test:
	go test ./..

assets: ui
	go run -tags=dev pkg/assets/generate.go

build: assets
	CGO_ENABLED=0 go build -o ./bin/webui .

dev: assets
	gin -a 9000 -b ./bin/gin-bin
