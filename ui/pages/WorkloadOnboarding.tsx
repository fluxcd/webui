import { Breadcrumbs } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import Flex from "../components/Flex";
import Link from "../components/Link";
import Page from "../components/Page";
import WorkloadOnboardingHints from "../components/WorkloadOnboardingHints";
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

function WorkloadOnboarding({ className }: Props) {
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
    <Page className={className}>
      <Breadcrumbs>
        <Link
          to={formatURL(PageRoute.Workloads, currentContext, currentNamespace)}
        >
          <Flex wide>
            <h2>Workloads</h2>
          </Flex>
        </Link>
        <h2>{workloadDetail.name}</h2>
        <h2>Add Workload</h2>
      </Breadcrumbs>
      {/* This is its own component to make the hook initial state easier to understand */}
      <WorkloadOnboardingHints workloadName={workloadDetail.name} />
    </Page>
  );
}

export default Styled(WorkloadOnboarding);
