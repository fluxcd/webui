import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";

type Props = {
  className?: string;
  children: any;
  to?: string;
};

const Styled = (c) => styled(c)``;

function Link({ className, children, to }: Props) {
  return (
    <RouterLink to={to} className={className}>
      {children}
    </RouterLink>
  );
}

export default Styled(Link);
