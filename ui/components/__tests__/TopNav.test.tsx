import { render, screen } from "@testing-library/react";
import "jest-styled-components";
import { stubbedClustersResponses, withContext } from "../../lib/test-utils";
import TopNav from "../TopNav";

describe("TopNav", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  describe("snapshots", () => {
    it("renders", async () => {
      const url = "/?context=my-context&namespace=default";

      const tree = render(withContext(TopNav, url, stubbedClustersResponses));
      expect((await screen.findByText("my-context")).textContent).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });
  });
  it("sets the current context", async () => {
    const url = "/?context=my-context&namespace=default";

    render(withContext(TopNav, url, stubbedClustersResponses));

    const input = await screen.findByDisplayValue("my-context");

    expect(input).toBeTruthy();
  });
  it("sets the current namespace", async () => {
    const ns = "some-ns";
    const url = `/?context=my-context&namespace=${ns}`;

    render(
      withContext(TopNav, url, {
        ...stubbedClustersResponses,
        listNamespacesForContext: { namespaces: [ns] },
      })
    );

    const input = await screen.findByDisplayValue(ns);
    expect(input).toBeTruthy();
  });
});
