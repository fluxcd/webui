import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import {
  ImageUpdateAutomation,
  UnstructuredObject,
} from "../rpc/clusters";
import { notifyError, notifySuccess } from "../util";
import { formatAPINamespace } from "./app";

type ImageUpdateAutomationList = { [name: string]: ImageUpdateAutomation };

export type UnstructuredObjectWithParent = UnstructuredObject & {
  parentUid?: string;
};

export function useImageUpdateAutomations(
  currentContext: string,
  currentNamespace: string
) {
  const [loading, setLoading] = useState(true);
  const { doAsyncError, clustersClient } = useContext(AppContext);
  const [imageUpdateAutomations, setImageUpdateAutomations] = useState({} as ImageUpdateAutomationList);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setLoading(true);
    setImageUpdateAutomations({});

    clustersClient
      .listImageUpdateAutomations({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
      })
      .then((res) => {
        const r = _.keyBy(res.imageUpdateAutomations, "name");
        setImageUpdateAutomations(r);
      })
      .catch((err) => {
        doAsyncError(
          "There was an error fetching imageUpdateAutomations",
          true,
          err.message
        );
      })
      .finally(() => setLoading(false));
  }, [currentContext, currentNamespace]);

  const syncImageUpdateAutomation = (iua: ImageUpdateAutomation) =>
  clustersClient
    .syncImageUpdateAutomation({
      contextname: currentContext,
      namespace: iua.namespace,
      imageupdateautomationname: iua.name,
    })
    .then(() => {
      setImageUpdateAutomations({
        ...imageUpdateAutomations,
        [iua.name]: iua,
      });
      notifySuccess("Sync successful");
    })
    .catch((err) => notifyError(err.message));

  return {
    imageUpdateAutomations,
    syncImageUpdateAutomation,
    loading,
  };
}
