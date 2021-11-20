import {
  Box,
  Breadcrumbs,
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
  useProviders,
} from "../lib/hooks/providers";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};

function ProviderDetail({ className }: Props) {
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();

  const {
    providers,
  } = useProviders(currentContext, currentNamespace);
  const provider = providers[query.providerId as string];

  if (!provider) {
    return null;
  }

  return (
    <Page className={className}>
      <Flex align wide>
        <Breadcrumbs>
          <Link
            to={formatURL(
              PageRoute.Providers,
              currentContext,
              currentNamespace
            )}
          >
            <h2>Providers</h2>
          </Link>
          <Flex wide>
            <h2>{provider.name}</h2>
          </Flex>
        </Breadcrumbs>
      </Flex>

      <Box marginBottom={2}>
        <Panel title="Info">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Namespace", value: provider.namespace },
              { key: "Type", value: provider.type },
              { key: "Channel", value: provider.channel },
              { key: "Username", value: provider.username },
              { key: "Address", value: provider.address },
              { key: "Proxy", value: provider.proxy },
              { key: "Secret", value: provider.secretref },
              { key: "Cert Secret", value: provider.certsecretref },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={provider.conditions} />
        </Panel>
      </Box>
    </Page>
  );
}

export default styled(ProviderDetail)`
  .MuiBreadcrumbs-root {
    width: 100%;
  }
`;
