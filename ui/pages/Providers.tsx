import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Page from "../components/Page";
import { useKubernetesContexts } from "../lib/hooks/app";
import { useProviders } from "../lib/hooks/providers";
import { Provider } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function Providers({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { providers, loading } = useProviders(
    currentContext,
    currentNamespace
  );

  const fields: {
    value: string | ((v: any) => JSX.Element | string);
    label: string;
  }[] = [
    {
      value: (iua: Provider) => (
        <Link
          to={formatURL(
            PageRoute.ProviderDetail,
            currentContext,
            currentNamespace,
            { providerId: iua.name }
          )}
        >
          {iua.name}
        </Link>
      ),
      label: "Name",
    },
    {
      label: "Ready",
      value: (iua: Provider) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");
        if (readyCondition) {
          return readyCondition.status;
        }
      },
    },
    {
      label: "Message",
      value: (iua: Provider) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");

        if (readyCondition && readyCondition.status === "False") {
          return readyCondition.message;
        }
      },
    },
  ];

  return (
    <Page loading={loading} className={className}>
      <h2>Providers</h2>
      <DataTable fields={fields} rows={providers} />
    </Page>
  );
}

export default Styled(Providers);
