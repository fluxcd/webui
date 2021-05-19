import * as React from "react";
import { AppContext } from "../components/AppStateProvider";
import { useKubernetesContexts, useNavigation } from "../lib/hooks/app";
import { AllNamespacesOption } from "../lib/types";
import { clustersClient, PageRoute } from "../lib/util";

export default function Redirector() {
  const { doAsyncError, setContexts } = React.useContext(AppContext);
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { navigate } = useNavigation();

  React.useEffect(() => {
    if (currentContext) {
      navigate(PageRoute.Home, currentContext, currentNamespace);
      return;
    }

    console.log("doing redirector things");

    // Runs once on app startup.
    clustersClient.listContexts({}).then(
      (res) => {
        setContexts(res.contexts);

        navigate(
          PageRoute.Home,
          res.currentcontext,
          currentNamespace || AllNamespacesOption
        );
      },
      (err) => {
        doAsyncError("Error getting contexts", true, err);
      }
    );
  }, []);

  return null;
}
