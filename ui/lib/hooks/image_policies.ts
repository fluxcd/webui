import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import {
  ImagePolicy,
  UnstructuredObject,
} from "../rpc/clusters";
import { formatAPINamespace } from "./app";

type ImagePolicyList = { [name: string]: ImagePolicy };

export type UnstructuredObjectWithParent = UnstructuredObject & {
  parentUid?: string;
};

export function useImagePolicies(
  currentContext: string,
  currentNamespace: string
) {
  const [loading, setLoading] = useState(true);
  const { doAsyncError, clustersClient } = useContext(AppContext);
  const [imagePolicies, setImagePolicies] = useState({} as ImagePolicyList);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setLoading(true);
    setImagePolicies({});

    clustersClient
      .listImagePolicies({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
      })
      .then((res) => {
        const r = _.keyBy(res.imagePolicies, "name");
        setImagePolicies(r);
      })
      .catch((err) => {
        doAsyncError(
          "There was an error fetching imagePolicies",
          true,
          err.message
        );
      })
      .finally(() => setLoading(false));
  }, [currentContext, currentNamespace]);

  return {
    imagePolicies,
    loading,
  };
}
