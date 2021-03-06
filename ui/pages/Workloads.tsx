import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Flex from "../components/Flex";
import Link from "../components/Link";
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
  ];

  return (
    <div className={className}>
      <Flex wide>
        <h2>Workloads</h2>
      </Flex>
      <DataTable fields={fields} rows={workloads} />
    </div>
  );
}

export default Styled(Workloads);
