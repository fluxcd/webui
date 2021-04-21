import { Box, Button } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Flex from "../components/Flex";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
import { useKubernetesContexts, useWorkloads } from "../lib/hooks";
import { Workload } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function Workloads({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const workloads = useWorkloads(currentContext, currentNamespace);

  if (!workloads) {
    return null;
  }

  const fields = [
    {
      label: "Name",
      value: (w: Workload) => (
        <Link
          to={formatURL(
            PageRoute.WorkloadDetail,
            currentContext,
            currentNamespace,
            { workloadId: w.name }
          )}
        >
          {w.name}
        </Link>
      ),
    },
    {
      label: "Namespace",
      value: "namespace",
    },
  ];

  return (
    <Page className={className}>
      <Flex wide>
        <h2>Workloads</h2>
      </Flex>
      <Box marginBottom={2}>
        <Panel title="Flux Enabled Workloads">
          <DataTable
            fields={fields}
            rows={_.filter(workloads, (w) => w.kustomizationRefName !== "")}
          />
        </Panel>
      </Box>
      <Panel title="Non-flux Workloads">
        <DataTable
          fields={[
            ...fields,
            {
              label: "",
              value: (w: Workload) => (
                <Link
                  style={{ textDecoration: "none" }}
                  to={formatURL(
                    PageRoute.WorkloadOnboarding,
                    currentContext,
                    currentNamespace,
                    { workloadId: w.name }
                  )}
                >
                  <Button variant="contained">Add to Flux</Button>
                </Link>
              ),
            },
          ]}
          rows={_.filter(workloads, (w) => w.kustomizationRefName === "")}
        />
      </Panel>
    </Page>
  );
}

export default Styled(Workloads);
