import { Box } from "@material-ui/core";
import { AlertTitle } from "@material-ui/lab";
import Alert from "@material-ui/lab/Alert";
import * as React from "react";
import styled from "styled-components";
import { AppContext } from "./AppStateProvider";
import LoadingPage from "./LoadingPage";

type Props = {
  className?: string;
  children: any;
  loading: boolean;
};
const Styled = (c) => styled(c)``;

function Page({ className, children, loading }: Props) {
  const { appState } = React.useContext(AppContext);

  if (loading) {
    return <LoadingPage />;
  }
  if (appState.error) {
    return (
      <React.Fragment>
        <Box paddingY={2}>
          <Alert severity="error">
            <AlertTitle>{appState.error.message}</AlertTitle>
            {appState.error.detail}
          </Alert>
        </Box>

        <div className={className}>{children}</div>
      </React.Fragment>
    );
  }
  return <div className={className}>{children}</div>;
}

export default Styled(Page);
