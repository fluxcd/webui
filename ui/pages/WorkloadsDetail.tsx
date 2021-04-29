import { Box, Breadcrumbs, Button } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import Flex from "../components/Flex";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
import SuggestedAction from "../components/SuggestedAction";
import {
  useKubernetesContexts,
  useNavigation,
  useWorkloads,
} from "../lib/hooks";
import { Workload } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";
type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function WorkloadsDetail({ className }: Props) {
  const { query, navigate } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const workloads = useWorkloads(currentContext, currentNamespace);

  const workloadDetail = _.find(workloads, {
    name: query.workloadId,
  }) as Workload;

  if (!workloadDetail) {
    return null;
  }

  return (
    <Page className={className}>
      <Breadcrumbs>
        <Link
          to={formatURL(PageRoute.Workloads, currentContext, currentNamespace)}
        >
          <Flex wide>
            <h2>Workloads</h2>
          </Flex>
        </Link>
        ,<h2>{workloadDetail.name}</h2>,
      </Breadcrumbs>
      <Box marginBottom={2}>
        <Panel title="Info">
          <KeyValueTable
            columns={[2]}
            pairs={[
              {
                key: "Reconciled By",
                value: workloadDetail.kustomizationRefName ? (
                  <Link
                    to={formatURL(
                      PageRoute.KustomizationDetail,
                      currentContext,
                      workloadDetail.kustomizationRefNamespace,
                      { kustomizationId: workloadDetail.kustomizationRefName }
                    )}
                  >
                    {workloadDetail.kustomizationRefName}
                  </Link>
                ) : (
                  "-"
                ),
              },
            ]}
          ></KeyValueTable>
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Containers">
          {_.map(_.get(workloadDetail, ["podTemplate", "containers"]), (c) => (
            <KeyValueTable
              key={c.name}
              columns={2}
              pairs={[
                { key: "Name", value: c.name },
                { key: "Image", value: c.image },
              ]}
            />
          ))}
        </Panel>
      </Box>
      {!workloadDetail.kustomizationRefName && (
        <Box marginBottom={2}>
          <SuggestedAction title="Add this workload to flux">
            <Flex wide center>
              <Button
                onClick={() =>
                  navigate(
                    PageRoute.WorkloadOnboarding,
                    currentContext,
                    currentNamespace,
                    { workloadId: workloadDetail.name }
                  )
                }
                variant="contained"
                color="primary"
              >
                Add Workload
              </Button>
            </Flex>
          </SuggestedAction>
        </Box>
      )}
    </Page>
  );
}

export default Styled(WorkloadsDetail);
