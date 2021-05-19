import * as React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import Flex from "../components/Flex";
import Page from "../components/Page";
import { useAppState } from "../lib/hooks/app";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function Error({ className }: Props) {
  const { error } = useAppState();

  const history = useHistory();

  React.useEffect(() => {
    if (!error) {
      history.push("/");
    }
  }, [error]);

  return (
    <div className={className}>
      <Page>
        <Flex wide center>
          <h2>Error</h2>
        </Flex>
        <Flex wide center>
          <div>{error && error.message}</div>
        </Flex>
        <Flex wide center>
          <div>
            <pre>{error && error.detail.toString()}</pre>
          </div>
        </Flex>
      </Page>
    </div>
  );
}

export default Styled(Error);
