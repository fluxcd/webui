import * as React from "react";
import { AppContext } from "../components/AppStateProvider";
import { useKubernetesContexts, useNavigation } from "../lib/hooks";
import { AllNamespacesOption } from "../lib/types";
import { clustersClient, PageRoute } from "../lib/util";

export default function Redirector() {
  const { doError, setContexts } = React.useContext(AppContext);
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { navigate } = useNavigation();

  React.useEffect(() => {
    if (currentContext) {
      navigate(PageRoute.Home, currentContext, currentNamespace);
      return;
    }

    // Runs once on app startup.
    clustersClient.listContexts({}).then(
      (res) => {
        setContexts(res.contexts);

        navigate(
          PageRoute.Home,
          res.currentContext,
          currentNamespace || AllNamespacesOption
        );
      },
      (err) => {
        doError("Error getting contexts", true, err);
      }
    );
  }, []);

  return null;
}
