import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import Flex from "../components/Flex";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
import {
  useKubernetesContexts,
  useKustomizations,
  useNavigation,
  useWorkloads,
} from "../lib/hooks";
import { Kustomization } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};

const Styled = (c) => styled(c)`
  .MuiBreadcrumbs-root {
    width: 100%;
  }
`;

const infoFields = [
  "sourceref",
  "namespace",
  "reconcileat",
  "path",
  "interval",
  "prune",
  "reconcilerequestat",
];

const formatInfo = (detail: Kustomization) =>
  _.map(_.pick(detail, infoFields), (v, k) => ({
    key: k,
    value: typeof v === "string" ? v : v.toString(),
  }));

function KustomizationDetail({ className }: Props) {
  const [syncing, setSyncing] = React.useState(false);
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const workloads = useWorkloads(currentContext, currentNamespace);

  const { kustomizations, syncKustomization } = useKustomizations(
    currentContext,
    currentNamespace
  );
  const kustomizationDetail = kustomizations[query.kustomizationId as string];

  const handleSyncClicked = () => {
    setSyncing(true);

    syncKustomization(kustomizationDetail).then(() => {
      setSyncing(false);
    });
  };

  if (!kustomizationDetail) {
    return null;
  }

  const overrides = {
    sourceref: [
      <Link
        to={formatURL(
          PageRoute.SourceDetail,
          currentContext,
          currentNamespace,
          {
            sourceType: kustomizationDetail.sourcerefkind.toLowerCase(),
            sourceId: kustomizationDetail.sourceref,
          }
        )}
      >
        {kustomizationDetail.sourceref}
      </Link>,
      "Source",
    ],
    reconcileat: [
      ` ${new Date(
        kustomizationDetail.reconcileat
      ).toLocaleTimeString()} ${new Date(
        kustomizationDetail.reconcileat
      ).toLocaleDateString()}`,
      "Last Reconcile",
    ],
    reconcilerequestat: [
      ` ${new Date(
        kustomizationDetail.reconcilerequestat
      ).toLocaleTimeString()} ${new Date(
        kustomizationDetail.reconcilerequestat
      ).toLocaleDateString()}`,
      "Last Reconcile Request",
    ],
  };

  return (
    <Page className={className}>
      <Flex align wide>
        <Breadcrumbs>
          <Link
            to={formatURL(
              PageRoute.Kustomizations,
              currentContext,
              currentNamespace
            )}
          >
            <h2>Kustomizations</h2>
          </Link>
          <Flex wide>
            <h2>{kustomizationDetail.name}</h2>
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
            columns={4}
            pairs={formatInfo(kustomizationDetail)}
            overrides={overrides}
          />
        </Panel>
      </Box>

      <Box marginBottom={2}>
        <Panel title="Conditions">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.map(kustomizationDetail.conditions, (c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.type}</TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell>
                      {new Date(c.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{c.reason}</TableCell>
                    <TableCell>{c.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Related Workloads">
          {_.map(workloads, (w) => {
            return (
              <div key={w.name}>
                <Link
                  to={formatURL(
                    PageRoute.WorkloadDetail,
                    currentContext,
                    w.namespace,
                    { workloadId: w.name }
                  )}
                >
                  {w.name}
                </Link>
              </div>
            );
          })}
        </Panel>
      </Box>
    </Page>
  );
}

export default Styled(KustomizationDetail);
