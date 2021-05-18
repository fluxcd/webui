import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import { Source } from "../rpc/clusters";
import { clustersClient, notifySuccess } from "../util";
import { formatAPINamespace } from "./app";

export enum SourceType {
  Git = "git",
  Bucket = "bucket",
  Helm = "helm",
  Chart = "chart",
}

function convertSourceTypeToInt(s: SourceType) {
  switch (s) {
    case SourceType.Git:
      return 0;
    case SourceType.Bucket:
      return 1;
    case SourceType.Helm:
      return 2;
    case SourceType.Chart:
      return 3;
  }
}

type SourceData = {
  [SourceType.Git]: Source[];
  [SourceType.Bucket]: Source[];
  [SourceType.Helm]: Source[];
};

const initialState = {
  [SourceType.Git]: [],
  [SourceType.Bucket]: [],
  [SourceType.Helm]: [],
};

type SourceHook = {
  loading: boolean;
  sources: SourceData;
  syncSource: (Source) => Promise<any>;
};

export function useSources(
  currentContext: string,
  currentNamespace: string
): SourceHook {
  const { doAsyncError } = useContext(AppContext);
  const [sources, setSources] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setSources(initialState);

    const p = _.map(SourceType, (s) =>
      clustersClient.listSources({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
        // @ts-ignore
        sourcetype: convertSourceTypeToInt(s),
      })
    );

    Promise.all(p)
      .then((arr) => {
        const d = {};
        _.each(arr, (a) => {
          _.each(a.sources, (src) => {
            const t = _.lowerCase(src.type);
            if (!d[t]) {
              d[t] = [];
            }

            d[t].push(src);
          });
        });
        setSources(d as SourceData);
      })
      .catch((err) => {
        doAsyncError("There was an error fetching sources", true, err.message);
      })
      .finally(() => setLoading(false));
  }, [currentContext, currentNamespace]);

  const syncSource = (s: Source) =>
    clustersClient
      .syncSource({
        contextname: currentContext,
        namespace: s.namespace,
        sourcename: s.name,
      })
      .then(() => {
        setSources({
          ...sources,
          [s.name]: s,
        });
        notifySuccess("Sync successful");
      })
      .catch((err) => {
        doAsyncError(err);
      });

  return { loading, sources, syncSource };
}
