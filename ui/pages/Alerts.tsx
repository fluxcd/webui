import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Page from "../components/Page";
import { useKubernetesContexts } from "../lib/hooks/app";
import { useAlerts } from "../lib/hooks/alerts";
import { Alert } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function Alerts({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { alerts, loading } = useAlerts(
    currentContext,
    currentNamespace
  );

  const fields: {
    value: string | ((v: any) => JSX.Element | string);
    label: string;
  }[] = [
    {
      value: (iua: Alert) => (
        <Link
          to={formatURL(
            PageRoute.AlertDetail,
            currentContext,
            currentNamespace,
            { alertId: iua.name }
          )}
        >
          {iua.name}
        </Link>
      ),
      label: "Name",
    },
    {
      label: "Ready",
      value: (iua: Alert) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");
        if (readyCondition) {
          return readyCondition.status;
        }
      },
    },
    {
      label: "Message",
      value: (iua: Alert) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");

        if (readyCondition && readyCondition.status === "False") {
          return readyCondition.message;
        }
      },
    },
  ];

  return (
    <Page loading={loading} className={className}>
      <h2>Alerts</h2>
      <DataTable fields={fields} rows={alerts} />
    </Page>
  );
}

export default Styled(Alerts);
