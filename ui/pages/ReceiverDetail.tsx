import {
  Box,
  Breadcrumbs,
} from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import ConditionsTable from "../components/ConditionsTable";
import CrossNamespaceObjectReferenceTable from "../components/CrossNamespaceObjectReferenceTable";
import Flex from "../components/Flex";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
import { useKubernetesContexts, useNavigation } from "../lib/hooks/app";
import {
  useReceivers,
} from "../lib/hooks/receivers";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};

function ReceiverDetail({ className }: Props) {
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();

  const {
    receivers,
  } = useReceivers(currentContext, currentNamespace);
  const receiver = receivers[query.receiverId as string];

  if (!receiver) {
    return null;
  }

  return (
    <Page className={className}>
      <Flex align wide>
        <Breadcrumbs>
          <Link
            to={formatURL(
              PageRoute.Receivers,
              currentContext,
              currentNamespace
            )}
          >
            <h2>Receicers</h2>
          </Link>
          <Flex wide>
            <h2>{receiver.name}</h2>
          </Flex>
        </Breadcrumbs>
      </Flex>

      <Box marginBottom={2}>
        <Panel title="Info">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Namespace", value: receiver.namespace },
              { key: "Type", value: receiver.type },
              { key: "Events", value: receiver.events.toString() },
              { key: "Secret", value: receiver.secretref },
              { key: "Suspend", value: String(receiver.suspend) },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Resources (A list of resources to be notified about changes)">
          <CrossNamespaceObjectReferenceTable crossNamespaceObjectReference={receiver.resources} />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Status">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "URL", value: receiver.url },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={receiver.conditions} />
        </Panel>
      </Box>
    </Page>
  );
}

export default styled(ReceiverDetail)`
  .MuiBreadcrumbs-root {
    width: 100%;
  }
`;
