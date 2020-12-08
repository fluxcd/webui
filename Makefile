all: test build

ui: static/index.html
	npm run build

test:
	go test ./..

assets: ui
	go run -tags=generate pkg/assets/generate.go

build: assets
	CGO_ENABLED=0 go build -o ./bin/webui .

dev: assets
	gin -a 9000 -b ./bin/gin-bin
