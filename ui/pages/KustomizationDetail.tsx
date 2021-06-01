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
import DataTable from "../components/DataTable";
import Flex from "../components/Flex";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
import { useKubernetesContexts, useNavigation } from "../lib/hooks/app";
import {
  PARENT_CHILD_LOOKUP,
  useKustomizations,
} from "../lib/hooks/kustomizations";
import { GroupVersionKind, Kustomization } from "../lib/rpc/clusters";
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
  "path",
  "interval",
  "prune",
  "lastappliedrevision",
];

const formatInfo = (detail: Kustomization) =>
  _.map(_.pick(detail, infoFields), (v, k) => ({
    key: k,
    value: typeof v === "string" ? v : v.toString(),
  }));

function KustomizationDetail({ className }: Props) {
  const [syncing, setSyncing] = React.useState(false);
  const [reconciledObjects, setReconciledObjects] = React.useState<
    GroupVersionKind[]
  >([]);
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();

  const {
    kustomizations,
    syncKustomization,
    getReconciledObjects,
    getChildrenRecursive,
  } = useKustomizations(currentContext, currentNamespace);
  const kustomizationDetail = kustomizations[query.kustomizationId as string];

  const handleSyncClicked = () => {
    setSyncing(true);

    syncKustomization(kustomizationDetail).then(() => {
      setSyncing(false);
    });
  };

  React.useEffect(() => {
    if (!kustomizationDetail) {
      return;
    }

    const { snapshots, name, namespace } = kustomizationDetail;

    const kinds = _.reduce(
      snapshots,
      (r, e) => {
        r = [...r, ...e.kinds];
        return r;
      },
      []
    );

    const uniq = _.uniqBy(kinds, "kind");

    const getChildren = async () => {
      const { objects } = await getReconciledObjects(name, namespace, uniq);

      const result = [];
      for (let o = 0; o < objects.length; o++) {
        const obj = objects[o];

        await getChildrenRecursive(result, obj, PARENT_CHILD_LOOKUP);
      }

      setReconciledObjects(_.flatten(result));
    };

    let timeout;
    function poll() {
      timeout = setTimeout(async () => {
        // Polling will stop if this errors.
        // Also prevents sending a request before the previous request finishes.
        await getChildren();
        poll();
      }, 5000);
    }

    // Get children now, to avoid waiting for the first poll() setTimeout.
    getChildren();
    // Start polling.
    poll();

    // Stop polling when the component unmounts
    return () => clearTimeout(timeout);
  }, [kustomizationDetail]);

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
    lastappliedrevision: [
      kustomizationDetail.lastappliedrevision,
      "Applied Revision",
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
            columns={3}
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
        <Panel title="Reconciled Objects">
          <DataTable
            sortFields={["name", "kind"]}
            fields={[
              { label: "Kind", value: (v) => v.groupversionkind.kind },
              { label: "Name", value: "name" },
              { label: "Namespace", value: "namespace" },
              { label: "Status", value: "status" },
            ]}
            rows={reconciledObjects}
          />
        </Panel>
      </Box>
    </Page>
  );
}

export default Styled(KustomizationDetail);
