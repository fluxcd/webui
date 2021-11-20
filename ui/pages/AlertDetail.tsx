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
  useAlerts,
} from "../lib/hooks/alerts";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};

function AlertDetail({ className }: Props) {
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();

  const {
    alerts,
  } = useAlerts(currentContext, currentNamespace);
  const alert = alerts[query.alertId as string];

  if (!alert) {
    return null;
  }

  return (
    <Page className={className}>
      <Flex align wide>
        <Breadcrumbs>
          <Link
            to={formatURL(
              PageRoute.Alerts,
              currentContext,
              currentNamespace
            )}
          >
            <h2>Alerts</h2>
          </Link>
          <Flex wide>
            <h2>{alert.name}</h2>
          </Flex>
        </Breadcrumbs>
      </Flex>

      <Box marginBottom={2}>
        <Panel title="Info">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Namespace", value: alert.namespace },
              { key: "Provider", value: <Link
              to={formatURL(
                PageRoute.ProviderDetail,
                currentContext,
                currentNamespace,
                {
                  providerId: alert.providerref,
                }
              )}
            >
              {alert.providerref}
            </Link> },
              { key: "Event Severity", value: alert.eventseverity },
              { key: "Exclusion List", value: alert.exclusionlist.toString() },
              { key: "Summary", value: alert.summary },
              { key: "Suspend", value: String(alert.suspend) },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Event Sources (Filter events based on the involved objects)">
          <CrossNamespaceObjectReferenceTable crossNamespaceObjectReference={alert.eventsources} />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={alert.conditions} />
        </Panel>
      </Box>
    </Page>
  );
}

export default styled(AlertDetail)`
  .MuiBreadcrumbs-root {
    width: 100%;
  }
`;
