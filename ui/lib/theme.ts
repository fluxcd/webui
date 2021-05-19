import green from "@material-ui/core/colors/green";
import purple from "@material-ui/core/colors/purple";
import { createMuiTheme } from "@material-ui/core/styles";
import { createGlobalStyle } from "styled-components";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Montserrat",
  },
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

export default theme;

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${(props: { theme: typeof theme }) =>
      props.theme.typography.fontFamily}, sans-serif;
    padding: 0;
    margin: 0;
  }
`;
