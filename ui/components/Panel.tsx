import { Card, CardContent } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";

type Props = {
  className?: string;
  title: string;
  children?: any;
};

const Title = styled.div`
  background-color: #f5f5f5;

  h3 {
    margin: 0;
    padding: 16px;
  }
`;

const Styled = (c) => styled(c)``;

function Panel({ className, children, title }: Props) {
  return (
    <div className={className}>
      <Card variant="outlined">
        <Title>
          <h3>{title}</h3>
        </Title>
        <CardContent>
          <div>{children}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Styled(Panel);
