import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  Box,
  Container,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core";
import styled, { ThemeProvider } from "styled-components";

import theme, { GlobalStyle } from "./lib/theme";
import LeftNav from "./components/LeftNav";

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
                <Route exact path="/" component={() => <div>some page </div>} />
                <Route exact path="*" component={() => <p>404</p>} />
              </Switch>
            </ContentCotainer>
          </AppContainer>
        </Router>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}
