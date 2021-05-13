import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Flex from "../components/Flex";
import Page from "../components/Page";
import { useKubernetesContexts, useNavigation } from "../lib/hooks";
import { Event } from "../lib/rpc/clusters";
import { clustersClient, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function Events({ className }: Props) {
  const { query, navigate } = useNavigation();
  const [nextCursor, setNextCursor] = React.useState("");
  const [remaining, setRemaining] = React.useState(parseInt(query.total) || 0);
  const [events, setEvents] = React.useState([]);
  const { currentContext, currentNamespace } = useKubernetesContexts();

  const limit = 5;

  React.useEffect(() => {
    const cursor = query && query.cursor;
    clustersClient
      .listEvents({
        contextname: currentContext,
        namespace: "flux-system",
        meta: { limit, cursor },
      })
      .then((res) => {
        setEvents(res.events);
        setNextCursor(res.meta.nextcursor);
        setRemaining(res.meta.remaining);
      });
  }, [query.cursor]);

  const rowCount = query.total ? parseInt(query.total) : remaining;
  const currentPage = query.pageNum ? parseInt(query.pageNum) : 0;

  return (
    <Page className={className}>
      <Flex wide>
        <h2>Events</h2>
      </Flex>
      <DataTable
        rowsPerPage={limit}
        count={rowCount}
        pageNum={currentPage}
        onChangePage={(pageNum) => {
          let c = "";

          if (pageNum > currentPage) {
            c = nextCursor;
          } else {
            c = query.prevCursor;
          }

          console.log(c);
          console.log(query.cursor);

          navigate(PageRoute.Events, currentContext, currentNamespace, {
            ...query,
            cursor: c,
            prevCursor: pageNum === 0 ? "" : query.cursor || "",
            total: rowCount,
            pageNum,
          });
        }}
        fields={[
          // { label: "Reason", value: "reason" },
          // { label: "Source", value: "source" },
          // { label: "Message", value: "message" },
          {
            label: "Timestamp",
            value: (e: Event) => {
              // timestamps come back in seconds, JS likes milliseconds
              const t = new Date(e.timestamp * 1000);
              const ts = `${t.toLocaleTimeString()} ${t.toLocaleDateString()}`;

              return ts;
            },
          },
        ]}
        rows={_.sortBy(events, "timestamp").reverse()}
      />
    </Page>
  );
}

export default Styled(Events);
