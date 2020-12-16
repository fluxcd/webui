package assets

import (
	"bytes"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"testing"

	"golang.org/x/net/html"
)

var mainjsRe = regexp.MustCompile(`main\.(.*)\.js`)

func extractUiEntrypointFilename(doc *html.Node) (string, error) {
	var mainjs string
	var crawler func(*html.Node)

	crawler = func(node *html.Node) {
		if node.Type == html.ElementNode && node.Data == "script" {
			for _, attr := range node.Attr {
				if attr.Key == "src" {
					if mainjsRe.MatchString(attr.Val) {
						mainjs = attr.Val
					}

					return
				}
			}

		}
		for child := node.FirstChild; child != nil; child = child.NextSibling {
			crawler(child)
		}
	}
	crawler(doc)
	if mainjs != "" {
		return mainjs, nil
	}
	return "", errors.New("no entrypoint script tag found")
}

func TestCommittedAssets(t *testing.T) {
	indexHTML, err := os.Open("../../dist/index.html")

	if err != nil {
		t.Errorf(err.Error())
	}
	doc, _ := html.Parse(indexHTML)
	mainJSFilename, err := extractUiEntrypointFilename(doc)
	if err != nil {
		t.Fatalf(err.Error())
	}

	mainJSFromAssets, err := Assets.Open(mainJSFilename)
	if err != nil {
		t.Fatalf(err.Error())
	}

	mainJSAssetsBytes, err := ioutil.ReadAll(mainJSFromAssets)
	if err != nil {
		t.Fatalf(err.Error())
	}

	mainJSActualBytes, err := ioutil.ReadFile("../../dist" + mainJSFilename)
	if err != nil {
		t.Fatalf(fmt.Sprintf("%s. You may need to run `make assets` and recommit", err.Error()))
	}

	if bytes.Compare(mainJSAssetsBytes, mainJSActualBytes) != 0 {
		t.Errorf("js generated assets do not match embedded assets")
	}

}
