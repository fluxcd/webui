RELEASE_VERSION=$(curl -s https://api.github.com/repos/fluxcd/flux2/releases | jq -r 'sort_by(.published_at) | .[-1] | .tag_name')
go mod edit -require github.com/fluxcd/flux2@${RELEASE_VERSION}
go mod tidy

