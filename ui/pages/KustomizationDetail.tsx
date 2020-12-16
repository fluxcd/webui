import * as React from "react";
import _ from "lodash";

import { useParams } from "react-router";
import styled from "styled-components";
import Link from "../components/Link";
import { useKustomizations } from "../lib/hooks";

type Props = {
  className?: string;
};

const Styled = (c) => styled(c)``;

function KustomizationDetail({ className }: Props) {
  const { kustomizationId } = useParams<{ kustomizationId: string }>();

  const kustomizations = useKustomizations();
  const kustomizationDetail = kustomizations[kustomizationId];

  if (!kustomizationDetail) {
    return null;
  }

  return (
    <div className={className}>
      <h2>{kustomizationDetail.name}</h2>
      <p>
        Source:{" "}
        <Link to={`/sources/${kustomizationDetail.sourceref}`}>
          {kustomizationDetail.sourceref}
        </Link>
      </p>
      <div>
        Conditions:{" "}
        <ul>
          {_.map(kustomizationDetail.conditions, (c) => (
            <li key={c.type}>
              {c.type}: {c.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Styled(KustomizationDetail);
