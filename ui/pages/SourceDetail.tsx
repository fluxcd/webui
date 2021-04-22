import { Box, Breadcrumbs } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import ConditionsTable from "../components/ConditionsTable";
import Flex from "../components/Flex";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
import { useKubernetesContexts, useNavigation, useSources } from "../lib/hooks";
import { Source } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};

function isHTTP(uri) {
  return uri.includes("http") || uri.includes("https");
}

function convertRefURLToGitProvider(uri: string) {
  if (isHTTP(uri)) {
    return uri;
  }

  const [, provider, org, repo] = uri.match(/git@(.*)\/(.*)\/(.*)/);

  return `https://${provider}/${org}/${repo}`;
}

const LayoutBox = styled(Box)`
  width: 100%;

  /* Override more specific MUI rules */
  margin-right: 0 !important;
  margin-left: 0 !important;
`;

const Styled = (c) => styled(c)``;

const infoFields = [
  "type",
  "namespace",
  "url",
  "timeout",
  "provider",
  "bucketName",
  "region",
  "gitImplementation",
  "timeout",
  "secretRefName",
];

const formatInfo = (detail: Source) =>
  _.map(_.pick(detail, infoFields), (v, k) => ({
    key: k,
    value: typeof v === "string" ? v : (v || "").toString(),
  }));

function SourceDetail({ className }: Props) {
  const { query } = useNavigation();
  const { sourceType, sourceId } = query;
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const sources = useSources(currentContext, currentNamespace);

  const sourceDetail: Source = _.find(sources[sourceType as string], {
    name: sourceId,
  });

  if (!sourceDetail) {
    return null;
  }

  const providerUrl = sourceDetail.reference ? (
    <a href={convertRefURLToGitProvider(sourceDetail.url)}>
      {sourceDetail.url}
    </a>
  ) : (
    sourceDetail.url
  );

  return (
    <Page className={className}>
      <Breadcrumbs>
        <Link
          to={formatURL(PageRoute.Sources, currentContext, currentNamespace)}
        >
          <h2>Sources</h2>
        </Link>
        <Flex wide>
          <h2>{sourceDetail.name}</h2>
        </Flex>
      </Breadcrumbs>
      <LayoutBox m={2}>
        <Panel title="Info">
          <KeyValueTable
            columns={3}
            overrides={{
              url: [providerUrl, "URL"],
            }}
            pairs={formatInfo(sourceDetail)}
          />
        </Panel>
      </LayoutBox>

      {sourceDetail.reference && (
        <LayoutBox m={2}>
          <Panel title="Git Reference">
            <KeyValueTable
              columns={2}
              pairs={[
                {
                  key: "Branch",
                  value: _.get(sourceDetail, ["reference", "branch"]),
                },
                {
                  key: "Tag",
                  value: _.get(sourceDetail, ["reference", "tag"]),
                },
                {
                  key: "Semver",
                  value: _.get(sourceDetail, ["reference", "semver"]),
                },
                {
                  key: "Commit",
                  value: _.get(sourceDetail, ["reference", "commit"]),
                },
              ]}
            />
          </Panel>
        </LayoutBox>
      )}

      <LayoutBox m={2}>
        <Panel title="Artifact">
          <KeyValueTable
            columns={2}
            pairs={[
              {
                key: "Checksum",
                value: _.get(sourceDetail, ["artifact", "checksum"]),
              },
              {
                key: "Revision",
                value: _.get(sourceDetail, ["artifact", "revision"]),
              },
            ]}
          />
        </Panel>
      </LayoutBox>

      <LayoutBox m={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={sourceDetail.conditions} />
        </Panel>
      </LayoutBox>
    </Page>
  );
}

export default Styled(SourceDetail);
