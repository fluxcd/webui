import { render, screen } from "@testing-library/react";
import { stubbedClustersResponses, withContext } from "../../lib/test-utils";
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
    const url =
      "/?context=my-context&namespace=default&kustomizationId=my-kustomization";
    const tree = render(
      withContext(KustomizationDetail, url, stubbedClustersResponses),
      container
    );

    expect(
      (await screen.findByText("my-kustomization")).textContent
    ).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});
