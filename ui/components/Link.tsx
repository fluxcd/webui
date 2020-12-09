import * as React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { normalizePath } from "../lib/util";

type Props = {
  className?: string;
  to: string;
  children: any;
  query?: object;
};

const Styled = (c) => styled(c)``;

function Link({ className, to, children, query }: Props) {
  const location = useLocation();
  const [context] = normalizePath(location.pathname);

  return (
    <a href={`/${context}${to}`} className={className}>
      {children}
    </a>
  );
}

export default Styled(Link);
