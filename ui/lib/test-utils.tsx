import { MuiThemeProvider } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import AppStateProvider from "../components/AppStateProvider";
import {
  GetChildObjectsRes,
  GetReconciledObjectsRes,
  Kustomization,
  ListContextsRes,
  ListKustomizationsRes,
  ListNamespacesForContextRes,
} from "./rpc/clusters";
import theme from "./theme";

type ClientOverrides = {
  listContexts: ListContextsRes;
  listNamespacesForContext: ListNamespacesForContextRes;
  listKustomizations?: ListKustomizationsRes;
  getReconciledObjects?: GetReconciledObjectsRes;
  getChildObjects?: GetChildObjectsRes;
};

export function withContext(
  TestComponent,
  simulatedUrl: string,
  clientOverrides: ClientOverrides
) {
  // Don't make the user wire up all the promise stuff to be interface-compliant
  const promisified = _.reduce(
    clientOverrides,
    (result, desiredResponse, method) => {
      result[method] = () =>
        new Promise((accept) => accept(desiredResponse as any));

      return result;
    },
    {}
  );

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[simulatedUrl]}>
          <AppStateProvider clustersClient={promisified}>
            <TestComponent />
          </AppStateProvider>
        </MemoryRouter>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

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

export const stubbedClustersResponses = {
  listContexts: {
    contexts: [{ name: "my-context" }, { name: "other-context" }],
    currentcontext: "other-context",
  },
  listNamespacesForContext: { namespaces: ["default"] },
  listKustomizations: {
    kustomizations: [k],
  },
  getReconciledObjects: {
    objects: [
      {
        groupversionkind: {
          group: "apps",
          version: "v1",
          kind: "Deployment",
        },
        name: "reconciled-deployment",
        namespace: "default",
        status: "Current",
      },
    ],
  },
  getChildObjects: {
    objects: [
      {
        groupversionkind: {
          group: "",
          version: "v1",
          kind: "Pod",
        },
        name: "reconciled-deployment-abc",
        namespace: "default",
        status: "Current",
      },
    ],
  },
};
