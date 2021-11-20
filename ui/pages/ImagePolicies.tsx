import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Page from "../components/Page";
import { useKubernetesContexts } from "../lib/hooks/app";
import { useImagePolicies } from "../lib/hooks/image_policies";
import { ImagePolicy } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function ImagePolicies({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { imagePolicies, loading } = useImagePolicies(
    currentContext,
    currentNamespace
  );

  const fields: {
    value: string | ((v: any) => JSX.Element | string);
    label: string;
  }[] = [
    {
      value: (iua: ImagePolicy) => (
        <Link
          to={formatURL(
            PageRoute.ImagePolicyDetail,
            currentContext,
            currentNamespace,
            { imagePolicyId: iua.name }
          )}
        >
          {iua.name}
        </Link>
      ),
      label: "Name",
    },
    {
      label: "Ready",
      value: (iua: ImagePolicy) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");
        if (readyCondition) {
          return readyCondition.status;
        }
      },
    },
    {
      label: "Message",
      value: (iua: ImagePolicy) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");

        if (readyCondition && readyCondition.status === "False") {
          return readyCondition.message;
        }
      },
    },
  ];

  return (
    <Page loading={loading} className={className}>
      <h2>ImagePolicies</h2>
      <DataTable fields={fields} rows={imagePolicies} />
    </Page>
  );
}

export default Styled(ImagePolicies);
