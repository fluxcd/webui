import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import {
  Receiver,
  UnstructuredObject,
} from "../rpc/clusters";
import { formatAPINamespace } from "./app";

type ReceiverList = { [name: string]: Receiver };

export type UnstructuredObjectWithParent = UnstructuredObject & {
  parentUid?: string;
};

export function useReceivers(
  currentContext: string,
  currentNamespace: string
) {
  const [loading, setLoading] = useState(true);
  const { doAsyncError, clustersClient } = useContext(AppContext);
  const [receivers, setReceivers] = useState({} as ReceiverList);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setLoading(true);
    setReceivers({});

    clustersClient
      .listReceivers({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
      })
      .then((res) => {
        const r = _.keyBy(res.receivers, "name");
        setReceivers(r);
      })
      .catch((err) => {
        doAsyncError(
          "There was an error fetching receivers",
          true,
          err.message
        );
      })
      .finally(() => setLoading(false));
  }, [currentContext, currentNamespace]);

  return {
    receivers,
    loading,
  };
}
