package clustersserver_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/fluxcd/webui/pkg/clustersserver"
	"github.com/fluxcd/webui/pkg/rpc/clusters"
	pb "github.com/fluxcd/webui/pkg/rpc/clusters"
	"github.com/fluxcd/webui/pkg/util"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	apiruntime "k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/rest"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/envtest"
	"sigs.k8s.io/controller-runtime/pkg/envtest/printer"
)

var testClustername = "test-cluster"
var testenv *envtest.Environment
var cfg *rest.Config
var testclient client.Client
var err error
var scheme *apiruntime.Scheme
var server *httptest.Server
var c clusters.Clusters

func TestAPIs(t *testing.T) {
	RegisterFailHandler(Fail)

	RunSpecsWithDefaultAndCustomReporters(t,
		"clusterserver suite",
		[]Reporter{printer.NewlineReporter{}})
}

var _ = BeforeSuite(func() {
	testenv = &envtest.Environment{CRDDirectoryPaths: []string{"../../tools/crd"}}

	cfg, err = testenv.Start()

	Expect(err).NotTo(HaveOccurred())

	scheme = util.CreateScheme()
})

var _ = BeforeEach(func() {
	testclient, err = client.New(cfg, client.Options{Scheme: scheme})
	Expect(err).NotTo(HaveOccurred())

	clusters := clustersserver.Server{
		AvailableContexts: []string{testClustername},
		InitialContext:    testClustername,
		ClientCache:       map[string]client.Client{},
		CreateClient: func(kubeContext string) (client.Client, error) {
			return testclient, nil
		},
	}

	clustersHandler := pb.NewClustersServer(&clusters, nil)

	server = httptest.NewServer(clustersHandler)

	c = pb.NewClustersProtobufClient(server.URL, http.DefaultClient)

})

var _ = AfterEach(func() {
	// err = testclient.Delete(context.Background(), "default")
	// Expect(err).NotTo(HaveOccurred(), "failed to delete test namespace")
	server.Close()
})

var _ = AfterSuite(func() {
	err = testenv.Stop()
	Expect(err).NotTo(HaveOccurred(), "error stopping testenv")
})
