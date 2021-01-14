import * as React from "react";
import _ from "lodash";

import { useParams } from "react-router";
import styled from "styled-components";
import Link from "../components/Link";
import { useKubernetesContexts, useKustomizations } from "../lib/hooks";
import { Button, CircularProgress } from "@material-ui/core";
import { DefaultClusters } from "../lib/rpc/clusters";
import { wrappedFetch } from "../lib/util";

type Props = {
  className?: string;
};

const Styled = (c) => styled(c)``;

function KustomizationDetail({ className }: Props) {
  const [syncing, setSyncing] = React.useState(false);
  const { kustomizationId } = useParams<{ kustomizationId: string }>();
  const { currentContext } = useKubernetesContexts();

  const kustomizations = useKustomizations();
  const kustomizationDetail = kustomizations[kustomizationId];

  const handleSyncClicked = () => {
    const clusters = new DefaultClusters("/api/clusters", wrappedFetch);

    setSyncing(true);

    clusters
      .syncKustomization({
        contextname: currentContext,
        withsource: false,
        kustomizationname: kustomizationId,
        kustomizationnamespace: "flux-system",
      })
      .then((res) => {
        setSyncing(false);
      });
  };

  if (!kustomizationDetail) {
    return null;
  }

  return (
    <div className={className}>
      <h2>{kustomizationDetail.name}</h2>
      <p>
        Source:{" "}
        <Link to={`/sources/${kustomizationDetail.sourceref}`}>
          {kustomizationDetail.sourceref}
        </Link>
      </p>
      <p>
        <div>
          <Button
            onClick={handleSyncClicked}
            color="primary"
            disabled={syncing}
            variant="contained"
          >
            {syncing ? <CircularProgress size={24} /> : "Sync"}
          </Button>
        </div>
      </p>
      <div>
        Conditions:{" "}
        <ul>
          {_.map(kustomizationDetail.conditions, (c) => (
            <li key={c.type}>
              {c.type}: {c.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Styled(KustomizationDetail);
