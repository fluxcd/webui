import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import { HelmRelease } from "../rpc/clusters";
import { notifyError, notifySuccess } from "../util";
import { formatAPINamespace } from "./app";

export function useHelmReleases(
  currentContext: string,
  currentNamespace: string
) {
  const [helmReleases, setHelmReleases] = useState<{
    [name: string]: HelmRelease;
  }>({});
  const { doAsyncError, clustersClient } = useContext(AppContext);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setHelmReleases({});

    clustersClient
      .listHelmReleases({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
      })
      .then((res) => {
        const releases = _.keyBy(res.helmReleases, "name");
        setHelmReleases(releases);
      })
      .catch((err) => {
        doAsyncError(
          "There was an error fetching helm releases",
          true,
          err.message
        );
      });
  }, [currentContext, currentNamespace]);

  const syncHelmRelease = (hr: HelmRelease) =>
    clustersClient
      .syncHelmRelease({
        contextname: currentContext,
        namespace: hr.namespace,
        helmreleasename: hr.name,
      })
      .then(() => {
        setHelmReleases({
          ...helmReleases,
          [hr.name]: hr,
        });
        notifySuccess("Sync successful");
      })
      .catch((err) => notifyError(err.message));

  return { helmReleases, syncHelmRelease };
}
