import { Box } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";

type Props = React.PropsWithChildren<{
  className?: string;
  title?: string;
}>;

const Styled = (c) => styled(c)`
  background-color: #d6d6ff;
  border: 2px solid #9992ff;
  border-radius: 2px;

  h4 {
    margin: 8px 0;
  }
`;

function SuggestedAction({ className, children, title }: Props) {
  return (
    <div className={className}>
      <Box m={2}>
        <h4>Suggested Action: {title}</h4>
        {children}
      </Box>
    </div>
  );
}

export default Styled(SuggestedAction);
