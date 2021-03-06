import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import Link from "../components/Link";
import Page from "../components/Page";
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
        <p>
          Reconciled by:{" "}
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
        </p>
      </Page>
    </div>
  );
}

export default Styled(WorkloadsDetail);
