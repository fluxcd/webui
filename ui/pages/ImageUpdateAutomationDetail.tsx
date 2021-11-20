import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress
} from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import ConditionsTable from "../components/ConditionsTable";
import Flex from "../components/Flex";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
import { useKubernetesContexts, useNavigation } from "../lib/hooks/app";
import {
  useImageUpdateAutomations,
} from "../lib/hooks/image_update_automations";
import { SourceType } from "../lib/hooks/sources";
import { ImageUpdateAutomation } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};

function ImageUpdateAutomationDetail({ className }: Props) {
  const [syncing, setSyncing] = React.useState(false);
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();

  const {
    imageUpdateAutomations,
    syncImageUpdateAutomation
  } = useImageUpdateAutomations(currentContext, currentNamespace);
  const imageUpdateAutomation = imageUpdateAutomations[query.imageUpdateAutomationId as string];

  const handleSyncClicked = () => {
    setSyncing(true);

    syncImageUpdateAutomation(imageUpdateAutomation).then(() => {
      setSyncing(false);
    });
  };

  function convertUnixTimestamp(timestamp: number) {
    const t = new Date(timestamp * 1000);
    const ts = `${t.toLocaleTimeString()} ${t.toLocaleDateString()}`;
    return ts;
  }

  if (!imageUpdateAutomation) {
    return null;
  }

  return (
    <Page className={className}>
      <Flex align wide>
        <Breadcrumbs>
          <Link
            to={formatURL(
              PageRoute.ImageUpdateAutomations,
              currentContext,
              currentNamespace
            )}
          >
            <h2>Image Update Automations</h2>
          </Link>
          <Flex wide>
            <h2>{imageUpdateAutomation.name}</h2>
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
        <Panel title="Info">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Namespace", value: imageUpdateAutomation.namespace },
              { key: "Source", value: <Link
              to={formatURL(
                PageRoute.SourceDetail,
                currentContext,
                currentNamespace,
                {
                  sourceType: imageUpdateAutomation.sourcerefkind.toLowerCase(),
                  sourceId: imageUpdateAutomation.sourceref,
                }
              )}
            >
              {imageUpdateAutomation.sourceref}
            </Link> },
              { key: "Interval", value: imageUpdateAutomation.interval },
              { key: "Update Path", value: imageUpdateAutomation.updatepath },
              { key: "Update Strategy", value: imageUpdateAutomation.updatestrategy },
              { key: "Suspend", value: String(imageUpdateAutomation.suspend) },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Status">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Last Automation Runtime", value: convertUnixTimestamp(imageUpdateAutomation.lastautomationruntime) },
              { key: "Last Push Commit", value: imageUpdateAutomation.lastpushcommit },
              { key: "Last Push Time", value: convertUnixTimestamp(imageUpdateAutomation.lastpushtime) },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={imageUpdateAutomation.conditions} />
        </Panel>
      </Box>
    </Page>
  );
}

export default styled(ImageUpdateAutomationDetail)`
  .MuiBreadcrumbs-root {
    width: 100%;
  }
`;
