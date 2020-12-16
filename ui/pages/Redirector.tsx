import * as React from "react";
import { useKubernetesContexts, useNavigation } from "../lib/hooks";
import { PageRoute } from "../lib/util";

export default function Redirector() {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { navigate } = useNavigation();

  React.useEffect(() => {
    if (currentContext) {
      navigate(PageRoute.Home, currentContext, currentNamespace);
    }
  });

  return null;
}
