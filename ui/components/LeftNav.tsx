import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import { useKubernetesContexts } from "../lib/hooks";
import Logo from "./Logo";

type Props = {
  className?: string;
};

const navItems = [
  { value: "sources", label: "Sources" },
  { value: "kustomizations", label: "Kustomizations" },
  { value: "helm_releases", label: "Helm Releases" },
];

const LinkTab = styled((props) => <Tab component="a" {...props} />)`
  span {
    align-items: flex-start;
  }
`;

const Styled = (cmp) => styled(cmp)`
  #context-selector {
    min-width: 120px;
  }
`;

function LeftNav({ className }: Props) {
  const [selectedContext, setSelectedContext] = React.useState("");
  const contexts = useKubernetesContexts();

  const location = useLocation();
  const normalizedPath = (location.pathname || "").replace("/", "");

  return (
    <div className={className}>
      <div>
        <Logo />
      </div>

      <div>
        <FormControl>
          <InputLabel id="context-selector">Contexts</InputLabel>
          <Select
            onChange={(ev) => {
              setSelectedContext(ev.target.value as string);
            }}
            value={selectedContext}
            id="context-selector"
            label="Contexts"
          >
            {_.map(contexts, (c) => (
              <MenuItem value={c.name} key={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <Tabs centered={false} orientation="vertical" value={normalizedPath}>
          {_.map(navItems, (n) => (
            <LinkTab
              value={n.value}
              key={n.value}
              label={n.label}
              href={`/${n.value}`}
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default Styled(LeftNav);
