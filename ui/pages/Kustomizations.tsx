import * as React from "react";
import _ from "lodash";
import styled from "styled-components";
import { useKubernetesContexts, useKustomizations } from "../lib/hooks";
import Link from "../components/Link";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function Kustomizations({ className }: Props) {
  const kustomizations = useKustomizations();

  return (
    <div className={className}>
      <ul>
        {_.map(kustomizations, (v, k) => (
          <li key={v.name}>
            <Link to={`/kustomizations/${v.name}`}>{v.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Styled(Kustomizations);
