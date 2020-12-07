all: test build

test:
	go test ./..

build:
	CGO_ENABLED=0 go build -o ./bin/webui ./cmd/webui

dev:
	cd cmd/webui/ && gin -a 9000 -b ./../../bin/gin-bin