import qs from "query-string";
import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AppContext } from "../../components/AppStateProvider";
import { Context } from "../rpc/clusters";
import { AllNamespacesOption } from "../types";
import { formatURL, normalizePath, PageRoute } from "../util";

// The backend doesn't like the word "all". Instead, it wants an empty string.
// Navigation might get weird if we use an empty string on the front-end.
// There may also be a naming collision with a namespace named "all".
export const formatAPINamespace = (ns: string) =>
  ns === AllNamespacesOption ? "" : ns;

export function useKubernetesContexts(): {
  contexts: Context[];
  namespaces: string[];
  currentContext: string;
  currentNamespace: string;
} {
  const { navigate } = useNavigation();

  const { contexts, namespaces, currentContext, currentNamespace } =
    useContext(AppContext);

  useEffect(() => {
    if (!currentContext) {
      navigate(PageRoute.Redirector, null, null);
    }
  }, []);

  return {
    contexts,
    namespaces: namespaces[currentContext] || [],
    currentContext: currentContext,
    currentNamespace: currentNamespace,
  };
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
    if (!location.pathname) {
      console.log(location);
    }
    const [pageName] = normalizePath(location.pathname);
    setCurrentPage(pageName as string);
  }, [location]);

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
