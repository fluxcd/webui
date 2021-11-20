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
  useImageRepositories,
} from "../lib/hooks/image_repositories";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};

function ImageRepositoryDetail({ className }: Props) {
  const [syncing, setSyncing] = React.useState(false);
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();

  const {
    imageRepositories,
    syncImageRepository
  } = useImageRepositories(currentContext, currentNamespace);
  const imageRepository = imageRepositories[query.imageRepositoryId as string];

  const handleSyncClicked = () => {
    setSyncing(true);

    syncImageRepository(imageRepository).then(() => {
      setSyncing(false);
    });
  };

  function convertUnixTimestamp(timestamp: number) {
    const t = new Date(timestamp * 1000);
    const ts = `${t.toLocaleTimeString()} ${t.toLocaleDateString()}`;
    return ts;
  }

  if (!imageRepository) {
    return null;
  }

  return (
    <Page className={className}>
      <Flex align wide>
        <Breadcrumbs>
          <Link
            to={formatURL(
              PageRoute.ImageRepositories,
              currentContext,
              currentNamespace
            )}
          >
            <h2>Image Repositories</h2>
          </Link>
          <Flex wide>
            <h2>{imageRepository.name}</h2>
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
              { key: "Namespace", value: imageRepository.namespace },
              { key: "Secret", value: imageRepository.secretref },
              { key: "Image", value: imageRepository.image },
              { key: "Interval", value: imageRepository.interval },
              { key: "Timeout", value: imageRepository.timeout },
              { key: "Cert Secret", value: imageRepository.certsecretref },
              { key: "Suspend", value: String(imageRepository.suspend) },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Last Scan Result">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Tag Count", value: imageRepository.lastscanresulttagcount },
              { key: "Scan Time", value: convertUnixTimestamp(imageRepository.lastscanresultscantime) },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={imageRepository.conditions} />
        </Panel>
      </Box>
    </Page>
  );
}

export default styled(ImageRepositoryDetail)`
  .MuiBreadcrumbs-root {
    width: 100%;
  }
`;
