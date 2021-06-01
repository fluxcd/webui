import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import {
  GroupVersionKind,
  Kustomization,
  SyncKustomizationRes,
  UnstructuredObject,
} from "../rpc/clusters";
import { notifyError, notifySuccess } from "../util";
import { formatAPINamespace } from "./app";

type KustomizationList = { [name: string]: Kustomization };

// Kubernetes does not allow us to query children by parents.
// We keep a list of common parent-child relationships
// to look up children recursively.
export const PARENT_CHILD_LOOKUP = {
  Deployment: {
    group: "apps",
    version: "v1",
    kind: "Deployment",
    children: [
      {
        group: "apps",
        version: "v1",
        kind: "ReplicaSet",
        children: [{ version: "v1", kind: "Pod" }],
      },
    ],
  },
};

export function useKustomizations(
  currentContext: string,
  currentNamespace: string
) {
  const [loading, setLoading] = useState(true);
  const { doAsyncError, clustersClient } = useContext(AppContext);
  const [kustomizations, setKustomizations] = useState({} as KustomizationList);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setLoading(true);
    setKustomizations({});

    clustersClient
      .listKustomizations({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
      })
      .then((res) => {
        const r = _.keyBy(res.kustomizations, "name");
        setKustomizations(r);
      })
      .catch((err) => {
        doAsyncError(
          "There was an error fetching kustomizations",
          true,
          err.message
        );
      })
      .finally(() => setLoading(false));
  }, [currentContext, currentNamespace]);

  const syncKustomization = (k: Kustomization) =>
    clustersClient
      .syncKustomization({
        contextname: currentContext,
        namespace: k.namespace,
        withsource: false,
        kustomizationname: k.name,
      })
      .then((res: SyncKustomizationRes) => {
        setKustomizations({
          ...kustomizations,
          [k.name]: res.kustomization,
        });
        notifySuccess("Sync successful");
      })
      .catch((err) => notifyError(err.message));

  const getReconciledObjects = (
    kustomizationname: string,
    kustomizationnamespace: string,
    kinds: GroupVersionKind[]
  ) => {
    return clustersClient.getReconciledObjects({
      contextname: currentContext,
      kustomizationname,
      kustomizationnamespace,
      kinds,
    });
  };

  const getChildObjects = (
    parentuid: string,
    groupversionkind: GroupVersionKind
  ) =>
    clustersClient.getChildObjects({
      parentuid,
      groupversionkind,
    });

  // Kubernetes does not let us query by parent-child relationship.
  // We need to get parent IDs and recursively pass them to children
  // in order to build the whole reconciliation "tree".
  const getChildrenRecursive = async (
    result: any,
    object: UnstructuredObject,
    lookup: any
  ) => {
    result.push(object);

    const k = lookup[object.groupversionkind.kind];

    if (k && k.children) {
      for (let i = 0; i < k.children.length; i++) {
        const child: GroupVersionKind = k.children[i];

        const res = await getChildObjects(object.uid, child);

        for (let q = 0; q < res.objects.length; q++) {
          const c = res.objects[q];

          // Dive down one level and update the lookup accordingly.
          await getChildrenRecursive(result, c, {
            [child.kind]: child,
          });
        }
      }
    }
  };

  return {
    kustomizations,
    syncKustomization,
    loading,
    getReconciledObjects,
    getChildObjects,
    getChildrenRecursive,
  };
}
