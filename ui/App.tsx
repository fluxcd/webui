import {
  Container,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core";
import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import AppStateProvider from "./components/AppStateProvider";
import Flex from "./components/Flex";
import LeftNav from "./components/LeftNav";
import TopNav from "./components/TopNav";
import theme, { GlobalStyle } from "./lib/theme";
import { PageRoute, prefixRoute } from "./lib/util";
import HelmReleaseDetail from "./pages/HelmReleaseDetail";
import HelmReleases from "./pages/HelmReleases";
import KustomizationDetail from "./pages/KustomizationDetail";
import Kustomizations from "./pages/Kustomizations";
import Redirector from "./pages/Redirector";
import SourceDetail from "./pages/SourceDetail";
import Sources from "./pages/Sources";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Error from "./pages/Error";
import Workloads from "./pages/Workloads";
import WorkloadsDetail from "./pages/WorkloadsDetail";

const AppContainer = styled.div`
  /* display: flex; */
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0;
`;

const NavContainer = styled.div`
  width: 240px;
`;

const ContentCotainer = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
`;

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <AppStateProvider>
            <AppContainer>
              <div style={{ width: "100%" }}>
                <TopNav />
              </div>
              <div>
                <Flex>
                  <NavContainer>
                    <LeftNav />
                  </NavContainer>
                  <ContentCotainer>
                    <Switch>
                      <Route exact path="/" component={Redirector} />
                      <Route exact path="/error" component={Error} />
                      <Route
                        exact
                        path={PageRoute.Kustomizations}
                        component={Kustomizations}
                      />
                      <Route
                        exact
                        path={PageRoute.KustomizationDetail}
                        component={KustomizationDetail}
                      />
                      <Route
                        exact
                        path={PageRoute.Sources}
                        component={Sources}
                      />
                      <Route
                        exact
                        path={PageRoute.SourceDetail}
                        component={SourceDetail}
                      />
                      <Route
                        exact
                        path={PageRoute.HelmReleases}
                        component={HelmReleases}
                      />
                      <Route
                        exact
                        path={PageRoute.HelmReleaseDetail}
                        component={HelmReleaseDetail}
                      />
                      <Route
                        exact
                        path={PageRoute.Workloads}
                        component={Workloads}
                      />
                      <Route
                        exact
                        path={PageRoute.WorkloadDetail}
                        component={WorkloadsDetail}
                      />
                      <Route exact path="*" component={() => <p>404</p>} />
                    </Switch>
                  </ContentCotainer>
                </Flex>
              </div>
              <ToastContainer
                position="top-center"
                autoClose={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
              />
            </AppContainer>
          </AppStateProvider>
        </Router>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}
