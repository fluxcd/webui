import {
  Container,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core";
import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import AppStateProvider from "./components/AppStateProvider";
import LeftNav from "./components/LeftNav";
import theme, { GlobalStyle } from "./lib/theme";
import KustomizationDetail from "./pages/KustomizationDetail";
import Kustomizations from "./pages/Kustomizations";
import Redirector from "./pages/Redirector";

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0;
`;

const NavContainer = styled.div`
  min-width: 200px;
`;

const ContentCotainer = styled.div`
  width: 100%;
`;

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <AppStateProvider>
          <GlobalStyle />
          <Router>
            <AppContainer>
              <NavContainer>
                <Container>
                  <LeftNav />
                </Container>
              </NavContainer>
              <ContentCotainer>
                <Switch>
                  <Route exact path="/" component={Redirector} />
                  <Route
                    exact
                    path="/:context/kustomizations"
                    component={Kustomizations}
                  />
                  <Route
                    exact
                    path="/:context/kustomizations/:kustomizationId"
                    component={KustomizationDetail}
                  />
                  <Route exact path="*" component={() => <p>404</p>} />
                </Switch>
              </ContentCotainer>
            </AppContainer>
          </Router>
        </AppStateProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}
