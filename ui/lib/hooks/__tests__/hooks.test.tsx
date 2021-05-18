import { render, screen } from "@testing-library/react";
import * as React from "react";
import { withContext } from "../../test-utils";
import { useKubernetesContexts } from "../app";

describe("app hooks", () => {
  describe("useKubernetesContexts", () => {
    let container;
    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });
    afterEach(() => {
      document.body.removeChild(container);
      container = null;
    });
    it("lists contexts", async () => {
      const TestComponent = () => {
        const { contexts, currentContext } = useKubernetesContexts();

        return (
          <ul>
            <p data-testid="current">{currentContext}</p>
            {(contexts || []).map((c) => (
              <li key={c.name}>{c.name}</li>
            ))}
          </ul>
        );
      };

      render(
        withContext(TestComponent, "/?context=other-context", {
          listContexts: {
            contexts: [{ name: "my-context" }, { name: "other-context" }],
            currentcontext: "other-context",
          },
          listNamespacesForContext: { namespaces: ["default"] },
        }),
        container
      );

      expect((await screen.findByText("my-context")).textContent).toBeTruthy();
      expect((await screen.findByTestId("current")).textContent).toEqual(
        "other-context"
      );
    });
    it("lists namespaces", async () => {
      const TestComponent = () => {
        const { namespaces } = useKubernetesContexts();

        return (
          <ul>
            {(namespaces || []).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        );
      };

      render(
        withContext(TestComponent, "/?context=my-context", {
          listContexts: { contexts: [{ name: "my-context" }] },
          listNamespacesForContext: { namespaces: ["default"] },
        }),
        container
      );

      expect((await screen.findByText("default")).textContent).toBeTruthy();
    });
  });
});
