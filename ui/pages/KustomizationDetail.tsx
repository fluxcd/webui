import * as React from "react";
import { useParams } from "react-router";
import styled from "styled-components";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function KustomizationDetail({ className }: Props) {
  const { kustomizationId } = useParams<{ kustomizationId: string }>();
  return (
    <div className={className}>
      <h2>{kustomizationId}</h2>
    </div>
  );
}

export default Styled(KustomizationDetail);
