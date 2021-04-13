import _ from "lodash";
import qs from "query-string";
import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AppContext } from "../components/AppStateProvider";
import {
  Context,
  HelmRelease,
  Kustomization,
  Source,
  Workload,
} from "./rpc/clusters";
import { AllNamespacesOption } from "./types";
import { clustersClient, formatURL, normalizePath, PageRoute } from "./util";
// The backend doesn't like the word "all". Instead, it wants an empty string.
// Navigation might get weird if we use an empty string on the front-end.
// There may also be a naming collision with a namespace named "all".
const formatAPINamespace = (ns: string) =>
  ns === AllNamespacesOption ? "" : ns;

export function useKubernetesContexts(): {
  contexts: Context[];
  namespaces: string[];
  currentContext: string;
  currentNamespace: string;
} {
  const { navigate } = useNavigation();
  const { context, namespace } = qs.parse(location.search) as {
    context: string;
    namespace: string;
  };
  const { contexts, namespaces } = useContext(AppContext);

  useEffect(() => {
    if (!context) {
      navigate(PageRoute.Redirector, null, null);
    }
  }, []);

  return {
    contexts,
    namespaces: namespaces[context] || [],
    currentContext: context,
    currentNamespace: namespace,
  };
}

type KustomizationList = { [name: string]: Kustomization };

export function useKustomizations(
  currentContext: string,
  currentNamespace: string
) {
  const { doError } = useContext(AppContext);
  const [kustomizations, setKustomizations] = useState({} as KustomizationList);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

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
        doError(
          "There was an error fetching kustomizations",
          true,
          err.message
        );
      });
  }, [currentContext, currentNamespace]);

  const syncKustomization = (k: Kustomization) =>
    clustersClient
      .syncKustomization({
        contextname: currentContext,
        namespace: k.namespace,
        withsource: false,
        kustomizationname: k.name,
      })
      .then(() => {
        setKustomizations({
          ...kustomizations,
          [k.name]: k,
        });
      });

  return { kustomizations, syncKustomization };
}

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

export function useSources(
  currentContext: string,
  currentNamespace: string
): SourceData {
  const { doError } = useContext(AppContext);
  const [sources, setSources] = useState({
    [SourceType.Git]: [],
    [SourceType.Bucket]: [],
    [SourceType.Helm]: [],
  });

  useEffect(() => {
    if (!currentContext) {
      return;
    }

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
        doError("There was an error fetching sources", true, err);
      });
  }, [currentContext, currentNamespace]);

  return sources;
}

export function useHelmReleases(
  currentContext: string,
  currentNamespace: string
): { [name: string]: HelmRelease } {
  const [helmReleases, setHelmReleases] = useState({});
  const { doError } = useContext(AppContext);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

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
        doError("There was an error fetching helm releases", true, err.message);
      });
  }, [currentContext, currentNamespace]);

  return helmReleases;
}

export function useAppState() {
  const { appState } = useContext(AppContext);
  return appState;
}

export function useNavigation() {
  const history = useHistory();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const [pageName] = normalizePath(location.pathname);
    setCurrentPage(pageName as string);
  }, [location.pathname]);

  return {
    currentPage,
    query: qs.parse(location.search),
    navigate: (
      page: PageRoute | null,
      context: string,
      namespace: string,
      query: any = {}
    ) => {
      let nextPage = page || currentPage;

      if (nextPage == "error") {
        nextPage = PageRoute.Home;
      }

      history.push(formatURL(nextPage as string, context, namespace, query));
    },
  };
}

export function useWorkloads(currentContext: string, currentNamespace: string) {
  const [workloads, setWorkloads] = useState([] as Workload[]);

  useEffect(() => {
    if (!currentContext || !currentNamespace) {
      return;
    }

    clustersClient
      .listWorkloads({
        contextname: currentContext,
        namespace:
          currentNamespace === AllNamespacesOption ? "" : currentNamespace,
      })
      .then((res) => {
        setWorkloads(res.workloads);
      });
  }, [currentContext, currentNamespace]);
  return workloads;
}
