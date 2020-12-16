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
import { useHistory, useLocation, useParams } from "react-router-dom";

import { useKubernetesContexts } from "../lib/hooks";
import Logo from "./Logo";
import Link from "./Link";
import { normalizePath } from "../lib/util";

type Props = {
  className?: string;
};

const navItems = [
  { value: "sources", label: "Sources" },
  { value: "kustomizations", label: "Kustomizations" },
  { value: "helm_releases", label: "Helm Releases" },
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
`;

function LeftNav({ className }: Props) {
  const {
    contexts,
    currentContext,
    setCurrentContext,
  } = useKubernetesContexts();

  const location = useLocation();
  const history = useHistory();
  const [, pageName] = normalizePath(location.pathname);

  return (
    <div className={className}>
      <div>
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div>
        <FormControl>
          <InputLabel id="context-selector">Contexts</InputLabel>
          <Select
            onChange={(ev) => {
              const nextCtx = ev.target.value;
              setCurrentContext(nextCtx as string);
              history.replace(`/${nextCtx}/${pageName}`);
            }}
            value={currentContext}
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
        <Tabs
          centered={false}
          orientation="vertical"
          value={pageName || navItems[0].value}
        >
          {_.map(navItems, (n) => (
            <LinkTab
              value={n.value}
              key={n.value}
              label={n.label}
              to={`/${n.value}`}
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default Styled(LeftNav);
