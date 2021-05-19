import { render, screen } from "@testing-library/react";
import { Kustomization } from "../../lib/rpc/clusters";
import { withContext } from "../../lib/test-utils";
import KustomizationDetail from "../KustomizationDetail";

describe("KustomizationDetail", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });
  it("renders", async () => {
    const k: Kustomization = {
      name: "my-kustomization",
      namespace: "default",
      path: "/k8s",
      sourceref: "my-source",
      conditions: [],
      interval: "1m",
      prune: false,
      reconcilerequestat: "",
      reconcileat: "",
      sourcerefkind: "Git",
    };
    const url =
      "/?context=my-context&namespace=default&kustomizationId=my-kustomization";
    const tree = render(
      withContext(KustomizationDetail, url, {
        listContexts: {
          contexts: [{ name: "my-context" }, { name: "other-context" }],
          currentcontext: "other-context",
        },
        listNamespacesForContext: { namespaces: ["default"] },
        listKustomizations: {
          kustomizations: [k],
        },
      }),
      container
    );

    expect(
      (await screen.findByText("my-kustomization")).textContent
    ).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});
