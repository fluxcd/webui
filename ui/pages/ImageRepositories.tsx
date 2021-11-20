import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Link from "../components/Link";
import Page from "../components/Page";
import { useKubernetesContexts } from "../lib/hooks/app";
import { useImageRepositories } from "../lib/hooks/image_repositories";
import { ImageRepository } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function ImageRepositories({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { imageRepositories, loading } = useImageRepositories(
    currentContext,
    currentNamespace
  );

  const fields: {
    value: string | ((v: any) => JSX.Element | string);
    label: string;
  }[] = [
    {
      value: (iua: ImageRepository) => (
        <Link
          to={formatURL(
            PageRoute.ImageRepositoryDetail,
            currentContext,
            currentNamespace,
            { imageRepositoryId: iua.name }
          )}
        >
          {iua.name}
        </Link>
      ),
      label: "Name",
    },
    {
      label: "Ready",
      value: (iua: ImageRepository) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");
        if (readyCondition) {
          return readyCondition.status;
        }
      },
    },
    {
      label: "Message",
      value: (iua: ImageRepository) => {
        const readyCondition = _.find(iua.conditions, (c) => c.type === "Ready");

        if (readyCondition && readyCondition.status === "False") {
          return readyCondition.message;
        }
      },
    },
  ];

  return (
    <Page loading={loading} className={className}>
      <h2>ImageRepositories</h2>
      <DataTable fields={fields} rows={imageRepositories} />
    </Page>
  );
}

export default Styled(ImageRepositories);
