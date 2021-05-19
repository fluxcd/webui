import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Page from "../components/Page";
import { useKubernetesContexts } from "../lib/hooks/app";
import { useKustomizations } from "../lib/hooks/kustomizations";
import { Kustomization } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function Kustomizations({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { kustomizations, loading } = useKustomizations(
    currentContext,
    currentNamespace
  );

  const fields: {
    value: string | ((v: any) => JSX.Element | string);
    label: string;
  }[] = [
    {
      value: (k: Kustomization) => (
        <Link
          to={formatURL(
            PageRoute.KustomizationDetail,
            currentContext,
            currentNamespace,
            { kustomizationId: k.name }
          )}
        >
          {k.name}
        </Link>
      ),
      label: "Name",
    },
    {
      label: "Ready",
      value: (k: Kustomization) => {
        const readyCondition = _.find(k.conditions, (c) => c.type === "Ready");
        if (readyCondition) {
          return readyCondition.status;
        }
      },
    },
    {
      label: "Message",
      value: (k: Kustomization) => {
        const readyCondition = _.find(k.conditions, (c) => c.type === "Ready");

        if (readyCondition && readyCondition.status === "False") {
          return readyCondition.message;
        }
      },
    },
  ];

  return (
    <Page loading={loading} className={className}>
      <h2>Kustomizations</h2>
      <DataTable fields={fields} rows={kustomizations} />
    </Page>
  );
}

export default Styled(Kustomizations);
