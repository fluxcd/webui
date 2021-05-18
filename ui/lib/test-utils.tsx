import { MuiThemeProvider } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import AppStateProvider from "../components/AppStateProvider";
import { ListContextsRes, ListNamespacesForContextRes } from "./rpc/clusters";
import theme from "./theme";

type ClientOverrides = {
  listContexts: ListContextsRes;
  listNamespacesForContext: ListNamespacesForContextRes;
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
