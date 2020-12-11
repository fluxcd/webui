import * as React from "react";
import styled from "styled-components";
// @ts-ignore
import imgSrc from "../../static/img/flux-horizontal-black.png";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)`
  img {
    max-height: 48px;
  }
`;

function Logo({ className }: Props) {
  return (
    <div className={className}>
      <img src={imgSrc} />
    </div>
  );
}

export default Styled(Logo);
