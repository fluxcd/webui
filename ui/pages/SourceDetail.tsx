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

  &:last-child {
    margin-left: 16px !important;
  }

  .MuiCard-root {
    height: 205px;
  }
`;

const Styled = (c) => styled(c)``;

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

  const providerUrl = convertRefURLToGitProvider(sourceDetail.url);

  return (
    <Page className={className}>
      <Box m={2}>
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
        <Panel title="Info">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Type", value: sourceDetail.type },
              {
                key: "URL",
                value: <a href={providerUrl}>{sourceDetail.url}</a>,
              },
            ]}
          />
        </Panel>
      </Box>
      <Box m={2}>
        <Flex wide>
          <LayoutBox m={1}>
            <Panel title="Git Reference">
              <KeyValueTable
                columns={2}
                pairs={[
                  { key: "Branch", value: sourceDetail.reference.branch },
                  { key: "Tag", value: sourceDetail.reference.tag },
                  { key: "Semver", value: sourceDetail.reference.semver },
                  { key: "Commit", value: sourceDetail.reference.commit },
                ]}
              />
            </Panel>
          </LayoutBox>
          <LayoutBox m={1}>
            <Panel title="Artifact">
              <KeyValueTable
                columns={1}
                pairs={[
                  { key: "Checksum", value: sourceDetail.artifact.checksum },
                  { key: "Revision", value: sourceDetail.artifact.revision },
                ]}
              />
            </Panel>
          </LayoutBox>
        </Flex>
      </Box>
      <Box m={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={sourceDetail.conditions} />
        </Panel>
      </Box>
    </Page>
  );
}

export default Styled(SourceDetail);
