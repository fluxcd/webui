import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import Flex from "../components/Flex";
import Page from "../components/Page";
import { useKubernetesContexts } from "../lib/hooks/app";
import useEvents from "../lib/hooks/events";
import { Event } from "../lib/rpc/clusters";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function Events({ className }: Props) {
  const { currentContext } = useKubernetesContexts();
  const { events, loading } = useEvents(currentContext);

  return (
    <Page loading={loading} className={className}>
      <Flex wide>
        <h2>Events</h2>
      </Flex>
      <DataTable
        fields={[
          { label: "Reason", value: "reason" },
          { label: "Source", value: "source" },
          { label: "Message", value: "message" },
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
