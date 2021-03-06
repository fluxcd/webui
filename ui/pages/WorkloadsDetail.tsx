import { Box } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
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
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const workloads = useWorkloads(currentContext, currentNamespace);

  const workloadDetail = _.find(workloads, {
    name: query.workloadId,
  }) as Workload;

  if (!workloadDetail) {
    return null;
  }

  return (
    <div className={className}>
      <Page>
        <h2>{workloadDetail.name}</h2>
        <Panel title="Info">
          <KeyValueTable
            columns={[2]}
            pairs={[
              {
                key: "Reconciled By",
                value: (
                  <Link
                    to={formatURL(
                      PageRoute.KustomizationDetail,
                      currentContext,
                      workloadDetail.kustomizationrefnamespace,
                      { kustomizationId: workloadDetail.kustomizationrefname }
                    )}
                  >
                    {workloadDetail.kustomizationrefname}
                  </Link>
                ),
              },
            ]}
          ></KeyValueTable>
        </Panel>
        <Box paddingTop={2}>
          <Panel title="Containers">
            {_.map(workloadDetail.podtemplate.containers, (c) => (
              <KeyValueTable
                key={c.name}
                columns={2}
                pairs={[
                  { key: "Name", value: c.name },
                  { key: "Image", value: c.image },
                ]}
              ></KeyValueTable>
            ))}
          </Panel>
        </Box>
      </Page>
    </div>
  );
}

export default Styled(WorkloadsDetail);
