import { ThemeProvider as MuiThemeProvider } from "@material-ui/core";
import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { ThemeProvider } from "styled-components";
import AppStateProvider from "./components/AppStateProvider";
import LeftNav from "./components/LeftNav";
import TopNav from "./components/TopNav";
import theme, { GlobalStyle, LAYOUT } from "./lib/theme";
import { PageRoute } from "./lib/util";
import Error from "./pages/Error";
import Events from "./pages/Events";
import HelmReleaseDetail from "./pages/HelmReleaseDetail";
import HelmReleases from "./pages/HelmReleases";
import KustomizationDetail from "./pages/KustomizationDetail";
import Kustomizations from "./pages/Kustomizations";
import Redirector from "./pages/Redirector";
import SourceDetail from "./pages/SourceDetail";
import Sources from "./pages/Sources";
import WorkloadOnboarding from "./pages/WorkloadOnboarding";
import Workloads from "./pages/Workloads";
import WorkloadsDetail from "./pages/WorkloadsDetail";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  overflow-y: auto;
  padding-top: ${LAYOUT.topNavHeight}px;
  padding-left: ${LAYOUT.leftNavWidth}px;
`;

const TopNavContainer = styled.div`
  width: 100%;
`;

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <AppStateProvider>
            <AppContainer>
              <TopNavContainer>
                <TopNav />
              </TopNavContainer>
              <LeftNav />
              <ContentContainer>
                <Switch>
                  <Route
                    exact
                    path={PageRoute.Redirector}
                    component={Redirector}
                  />
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
                  <Route exact path={PageRoute.Sources} component={Sources} />
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
                  <Route exact path={PageRoute.Events} component={Events} />
                  <Route
                    exact
                    path={PageRoute.WorkloadOnboarding}
                    component={WorkloadOnboarding}
                  />
                  <Route exact path="*" component={() => <p>404</p>} />
                </Switch>
              </ContentContainer>

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
