import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Page from "../components/Page";
import { useKubernetesContexts } from "../lib/hooks/app";
import { useImageUpdateAutomations } from "../lib/hooks/image_update_automations";
import { ImageUpdateAutomation } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function ImageUpdateAutomations({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { imageUpdateAutomations, loading } = useImageUpdateAutomations(
    currentContext,
    currentNamespace
  );

  const fields: {
    value: string | ((v: any) => JSX.Element | string);
    label: string;
  }[] = [
    {
      value: (iua: ImageUpdateAutomation) => (
        <Link
          to={formatURL(
            PageRoute.ImageUpdateAutomationDetail,
            currentContext,
            currentNamespace,
            { imageUpdateAutomationId: iua.name }
          )}
        >
          {iua.name}
        </Link>
      ),
      label: "Name",
    },
    {
      label: "Ready",
      value: (iua: ImageUpdateAutomation) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");
        if (readyCondition) {
          return readyCondition.status;
        }
      },
    },
    {
      label: "Message",
      value: (iua: ImageUpdateAutomation) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");

        if (readyCondition && readyCondition.status === "False") {
          return readyCondition.message;
        }
      },
    },
  ];

  return (
    <Page loading={loading} className={className}>
      <h2>ImageUpdateAutomations</h2>
      <DataTable fields={fields} rows={imageUpdateAutomations} />
    </Page>
  );
}

export default Styled(ImageUpdateAutomations);
