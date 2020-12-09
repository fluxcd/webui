import * as React from "react";

export const AppContext = React.createContext(null as any);

export default function AppStateProvider(props) {
  const [contexts, setContexts] = React.useState([]);
  const [currentContext, setCurrentContext] = React.useState("");

  const value = {
    contexts,
    currentContext,
    setContexts,
    setCurrentContext,
  };

  return <AppContext.Provider value={value} {...props} />;
}
