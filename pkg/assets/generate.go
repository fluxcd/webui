// +build ignore

package main

import (
	"log"

	"github.com/fluxcd/webui/pkg/assets"
	"github.com/shurcooL/vfsgen"
)

func main() {
	err := vfsgen.Generate(assets.Assets, vfsgen.Options{
		Filename:     "pkg/assets/assets.go",
		PackageName:  "assets",
		BuildTags:    "!generate",
		VariableName: "Assets",
	})
	if err != nil {
		log.Fatalln(err)
	}
}
