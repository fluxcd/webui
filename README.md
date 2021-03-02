# webui

## Development

To set up a development environment

1. Install `go` v1.15
2. Install Node.js version 14.15.1
3. Install `gin`: `go get github.com/codegangsta/gin`
4. [Install `kubebuilder`](https://book.kubebuilder.io/quick-start.html#installation)
5. `npm install --silent` to install UI dependencies
6. `make dev` to compile and run the app
7. `npm start` to start the frontend dev server (with hot-reloading)

To generate protobuf files natively on your OS, install [protoc](https://grpc.io/docs/protoc-installation/), then install these packages:

```shell
go get -u github.com/golang/protobuf/protoc-gen-go
go get -u github.com/twitchtv/twirp/protoc-gen-twirp
go get -u go.larrymyers.com/protoc-gen-twirp_typescript
```

Then run:

```shell
make proto-native
```
