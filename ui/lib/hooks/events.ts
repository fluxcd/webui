import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import { clustersClient } from "../util";

export default function useEvents(currentContext) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { doAsyncError } = useContext(AppContext);

  useEffect(() => {
    setLoading(true);
    setEvents([]);
    clustersClient
      .listEvents({
        contextname: currentContext,
        namespace: "flux-system",
      })
      .then((res) => {
        setEvents(res.events);
      })
      .catch((err) => {
        doAsyncError("There was an error fetching events", true, err.message);
      })
      .finally(() => setLoading(false));
  }, [currentContext]);

  return { events, loading };
}
