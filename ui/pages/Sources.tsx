import { Tab, Tabs } from "@material-ui/core";
import * as React from "react";
import _ from "lodash";
import styled from "styled-components";
import { useSources, SourceType } from "../lib/hooks";
import Link from "../components/Link";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

const tabs = [
  { value: SourceType.Git, label: "Git Repos" },
  { value: SourceType.Bucket, label: "Buckets" },
  { value: SourceType.Helm, label: "Helm Repos" },
];

const TabPanel = ({ value, children, index }) => (
  <div> {value === index && <div>{children}</div>} </div>
);

function Sources({ className }: Props) {
  const [selectedTab, setTab] = React.useState(SourceType.Git);
  const sources = useSources(selectedTab);

  return (
    <div className={className}>
      <h2>Sources</h2>
      <div>
        <Tabs
          onChange={(_, val) => {
            setTab(val);
          }}
          value={selectedTab}
        >
          {_.map(tabs, (t) => (
            <Tab label={t.label} key={t.value} value={t.value} />
          ))}
        </Tabs>
        {_.map(tabs, (t) => (
          <TabPanel key={t.value} value={selectedTab} index={t.value}>
            <ul>
              {_.map(sources, (s) => (
                <li key={s.name}>
                  <Link to={`/sources/${selectedTab}/${s.name}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </TabPanel>
        ))}
      </div>
    </div>
  );
}

export default Styled(Sources);
