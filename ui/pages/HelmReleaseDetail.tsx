import { Box, Breadcrumbs, Button, CircularProgress } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";
import ConditionsTable from "../components/ConditionsTable";
import Flex from "../components/Flex";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
import { useKubernetesContexts, useNavigation } from "../lib/hooks/app";
import { useHelmReleases } from "../lib/hooks/helm_releases";
import { SourceType } from "../lib/hooks/sources";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)`
  ${Panel} {
    width: 100%;
    &:first-child {
      margin-right: 16px;
    }
  }

  .MuiBox-root {
    margin-left: 0 !important;
  }
`;

function HelmReleaseDetail({ className }: Props) {
  const [syncing, setSyncing] = React.useState(false);
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { helmReleases, syncHelmRelease } = useHelmReleases(
    currentContext,
    currentNamespace
  );
  const helmRelease = helmReleases[query.helmReleaseId as string];

  const handleSyncClicked = () => {
    setSyncing(true);

    syncHelmRelease(helmRelease).then(() => {
      setSyncing(false);
    });
  };

  if (!helmRelease) {
    return null;
  }

  return (
    <Page className={className}>
      <Flex between align wide>
        <Breadcrumbs>
          <Link
            to={formatURL(
              PageRoute.HelmReleases,
              currentContext,
              currentNamespace
            )}
          >
            <h2>Helm Releases</h2>
          </Link>
          <Flex wide>
            <h2>{helmRelease.name}</h2>
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

      <Box marginBottom={2}>
        <Flex wide>
          <Panel title="Info">
            <KeyValueTable
              columns={2}
              pairs={[
                { key: "Interval", value: helmRelease.interval },
                { key: "Chart", value: helmRelease.chartname },
                { key: "Version", value: helmRelease.version },
              ]}
            />
          </Panel>
          <Panel title="Source">
            <KeyValueTable
              columns={2}
              overrides={{
                Name: [
                  <Link
                    to={formatURL(
                      PageRoute.SourceDetail,
                      currentContext,
                      currentNamespace,
                      {
                        sourceType: SourceType.Helm,
                        sourceId: helmRelease.sourcename,
                      }
                    )}
                  >
                    {helmRelease.sourcename}
                  </Link>,
                  "Source",
                ],
              }}
              pairs={[
                { key: "Name", value: helmRelease.sourcename },
                { key: "Kind", value: helmRelease.sourcekind },
                { key: "Namespace", value: helmRelease.sourcenamespace },
              ]}
            />
          </Panel>
        </Flex>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={helmRelease.conditions} />
        </Panel>
      </Box>
    </Page>
  );
}

export default Styled(HelmReleaseDetail);
