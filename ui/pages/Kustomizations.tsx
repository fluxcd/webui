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
  const { currentContext } = useKubernetesContexts();
  const kustomizations = useKustomizations(currentContext);

  return (
    <div className={className}>
      <ul>
        {_.map(kustomizations, (k) => (
          <li key={k.name}>
            <Link to={`/kustomizations/${k.name}`}>{k.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Styled(Kustomizations);
