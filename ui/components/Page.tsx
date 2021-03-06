import * as React from "react";
import styled from "styled-components";

type Props = {
  className?: string;
  children: any;
};
const Styled = (c) => styled(c)``;

function Page({ className, children }: Props) {
  return <div className={className}>{children}</div>;
}

export default Styled(Page);
