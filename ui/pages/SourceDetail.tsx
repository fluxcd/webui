import { Box, Breadcrumbs, Button, CircularProgress } from "@material-ui/core";
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

function SourceDetail({ className }: Props) {
  const [syncing, setSyncing] = React.useState(false);
  const { query } = useNavigation();
  const { sourceType, sourceId } = query;
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { sources, syncSource } = useSources(currentContext, currentNamespace);

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

  console.log(sourceDetail);

  const handleSyncClicked = () => {
    setSyncing(true);

    syncSource(sourceDetail).then(() => {
      setSyncing(false);
    });
  };

  return (
    <Page className={className}>
      <Flex align wide between>
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
        <Button
          onClick={handleSyncClicked}
          color="primary"
          disabled={syncing}
          variant="contained"
        >
          {syncing ? <CircularProgress size={24} /> : "Sync"}
        </Button>
      </Flex>

      <LayoutBox m={2}>
        <Panel title="Info">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Type", value: sourceDetail.type },
              {
                key: "URL",
                value: providerUrl,
              },
              { key: "Timeout", value: sourceDetail.timeout },
            ]}
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
