import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";

type Props = {
  className?: string;
  children: any;
  to?: string;
  href?: string;
};

const Styled = (c) => styled(c)``;

function Link({ className, to, href, ...rest }: Props) {
  return href ? (
    <a href={href} {...rest} />
  ) : (
    <RouterLink {...rest} to={to} className={className} />
  );
}

export default Styled(Link);
