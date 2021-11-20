import { ThemeProvider as MuiThemeProvider } from "@material-ui/core";
import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { ThemeProvider } from "styled-components";
import AppStateProvider from "./components/AppStateProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import Flex from "./components/Flex";
import LeftNav from "./components/LeftNav";
import TopNav from "./components/TopNav";
import theme, { GlobalStyle } from "./lib/theme";
import { clustersClient, PageRoute } from "./lib/util";
import Error from "./pages/Error";
import Events from "./pages/Events";
import HelmReleaseDetail from "./pages/HelmReleaseDetail";
import HelmReleases from "./pages/HelmReleases";
import KustomizationDetail from "./pages/KustomizationDetail";
import Kustomizations from "./pages/Kustomizations";
import ImagePolicies from "./pages/ImagePolicies";
import ImagePolicyDetail from "./pages/ImagePolicyDetail";
import ImageRepositories from "./pages/ImageRepositories";
import ImageRepositoryDetail from "./pages/ImageRepositoryDetail";
import ImageUpdateAutomations from "./pages/ImageUpdateAutomations";
import ImageUpdateAutomationDetail from "./pages/ImageUpdateAutomationDetail";
import Alerts from "./pages/Alerts";
import AlertDetail from "./pages/AlertDetail";
import Providers from "./pages/Providers";
import ProviderDetail from "./pages/ProviderDetail";
import Receivers from "./pages/Receivers";
import ReceiverDetail from "./pages/ReceiverDetail";
import Redirector from "./pages/Redirector";
import SourceDetail from "./pages/SourceDetail";
import Sources from "./pages/Sources";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0;
`;

const NavContainer = styled.div`
  width: 280px;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
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
          <ErrorBoundary>
            <AppStateProvider clustersClient={clustersClient}>
              <AppContainer>
                <TopNavContainer>
                  <TopNav />
                </TopNavContainer>
                <Flex>
                  <NavContainer>
                    <LeftNav />
                  </NavContainer>
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
                        path={PageRoute.ImagePolicies}
                        component={ImagePolicies}
                      />
                      <Route
                        exact
                        path={PageRoute.ImagePolicyDetail}
                        component={ImagePolicyDetail}
                      />
                      <Route
                        exact
                        path={PageRoute.ImageRepositories}
                        component={ImageRepositories}
                      />
                      <Route
                        exact
                        path={PageRoute.ImageRepositoryDetail}
                        component={ImageRepositoryDetail}
                      />
                      <Route
                        exact
                        path={PageRoute.ImageUpdateAutomations}
                        component={ImageUpdateAutomations}
                      />
                      <Route
                        exact
                        path={PageRoute.ImageUpdateAutomationDetail}
                        component={ImageUpdateAutomationDetail}
                      />
                      <Route
                        exact
                        path={PageRoute.Alerts}
                        component={Alerts}
                      />
                      <Route
                        exact
                        path={PageRoute.AlertDetail}
                        component={AlertDetail}
                      />
                      <Route
                        exact
                        path={PageRoute.Providers}
                        component={Providers}
                      />
                      <Route
                        exact
                        path={PageRoute.ProviderDetail}
                        component={ProviderDetail}
                      />
                      <Route
                        exact
                        path={PageRoute.Receivers}
                        component={Receivers}
                      />
                      <Route
                        exact
                        path={PageRoute.ReceiverDetail}
                        component={ReceiverDetail}
                      />
                      <Route exact path={PageRoute.Events} component={Events} />

                      <Route exact path="*" component={() => <p>404</p>} />
                    </Switch>
                  </ContentContainer>
                </Flex>
                <ToastContainer
                  position="top-center"
                  autoClose={10000}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                />
              </AppContainer>
            </AppStateProvider>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}
