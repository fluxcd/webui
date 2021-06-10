import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import "jest-styled-components";
import * as React from "react";
import { Router } from "react-router";
import { useKubernetesContexts } from "../../lib/hooks/app";
import {
  createMockClient,
  stubbedClustersResponses,
} from "../../lib/test-utils";
import AppStateProvider from "../AppStateProvider";

describe("AppStateProvider", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it("sets the namespace from the url", async () => {
    const ns = "my-ns";
    const otherNs = "other-ns";
    const url = `/?context=my-context&namespace=${ns}`;

    const client = createMockClient({
      ...stubbedClustersResponses,
      listNamespacesForContext: { namespaces: [ns, otherNs] },
    });

    const TestComponent = () => {
      const { currentNamespace } = useKubernetesContexts();

      return <div data-testid="ns">{currentNamespace}</div>;
    };

    const history = createMemoryHistory();
    history.push(url);

    render(
      <Router history={history}>
        <AppStateProvider clustersClient={client}>
          <TestComponent />
        </AppStateProvider>
      </Router>
    );
    expect((await screen.findByTestId("ns")).textContent).toEqual(ns);

    // simulate navigation to another namespace
    history.push(`/?context=my-context&namespace=${otherNs}`);

    expect((await screen.findByTestId("ns")).textContent).toEqual(otherNs);
  });
});
