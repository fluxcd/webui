import { Tab, Tabs } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { useKubernetesContexts, useNavigation } from "../lib/hooks";
import { formatURL, getNavValue, PageRoute } from "../lib/util";
import Link from "./Link";

type Props = {
  className?: string;
};

const navItems = [
  { value: PageRoute.Workloads, label: "Workloads" },
  { value: PageRoute.Sources, label: "Sources" },
  { value: PageRoute.Kustomizations, label: "Kustomizations" },
  { value: PageRoute.HelmReleases, label: "Helm Releases" },
  { value: PageRoute.Events, label: "Events" },
];

const LinkTab = styled((props) => (
  <Tab
    component={React.forwardRef((p, ref) => (
      <Link innerRef={ref} {...p} />
    ))}
    {...props}
  />
))`
  span {
    align-items: flex-start;
  }
`;

const Styled = (cmp) => styled(cmp)`
  #context-selector {
    min-width: 120px;
  }

  background-color: #f5f5f5;
  height: 100vh;
  padding-left: 8px;
`;

function LeftNav({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { currentPage } = useNavigation();

  return (
    <div className={className}>
      <div>
        <Tabs
          centered={false}
          orientation="vertical"
          value={getNavValue(currentPage)}
        >
          {_.map(navItems, (n) => (
            <LinkTab
              value={n.value}
              key={n.value}
              label={n.label}
              to={formatURL(n.value, currentContext, currentNamespace)}
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default Styled(LeftNav);
