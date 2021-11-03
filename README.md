# Flux Web UI

## Project Status

:warning: This project is currently **on hold**, because the maintainers do not have capacity to
develop it further at present. Please get in touch in [#flux-contributors](https://slack.cncf.io/)
if you are interested in helping to restart this project.

See [the monitoring section of the Flux documentation](https://fluxcd.io/docs/guides/monitoring/)
for how to install Flux's Grafana dashboards.

## Installation

To install the Flux Web UI:

1. Download the latest release from the [releases page](https://github.com/fluxcd/webui/releases)
2. Extract the binary from the downloaded archive
3. Run the server in your terminal: `./flux_webui`
4. You will see a log message letting you know startup was successful: `2021-06-03T13:26:37.552-0700 INFO Serving on port 9000`
5. Navigate to [http://localhost:9000](http://localhost:9000)

## Development

To set up a development environment

1. Install `go` v1.16
2. Install Node.js version 14.15.1
3. Install `reflex` for automated server builds: `go get github.com/cespare/reflex`
4. [Install `kubebuilder`](https://book.kubebuilder.io/quick-start.html#installation)
5. `npm install` to install UI dependencies
6. `make dev` to compile and run the app
7. `npm start` to start the frontend dev server (with hot-reloading)
8. Navigate to http://localhost:1234 to view the frontend dev UI (with hot-reloading)
9. Navigate to http://localhost:9000 to see the UI served from the `go` program

To generate protobuf files natively on your OS, install [protoc](https://grpc.io/docs/protoc-installation/), then install these packages:

```shell
go get -u github.com/golang/protobuf/protoc-gen-go
go get -u github.com/twitchtv/twirp/protoc-gen-twirp
go get -u go.larrymyers.com/protoc-gen-twirp_typescript
```

Then run:

```shell
make proto
```

To run tests:

```shell
make test
```
