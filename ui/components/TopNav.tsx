import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { useKubernetesContexts, useNavigation } from "../lib/hooks/app";
import { AllNamespacesOption } from "../lib/types";
import { formatURL, getNavValue, PageRoute } from "../lib/util";
import Flex from "./Flex";
import Link from "./Link";
import Logo from "./Logo";

const allNamespaces = "All Namespaces";

type Props = {
  className?: string;
};

const NavWrapper = styled(Flex)`
  height: 60px;
  align-items: flex-end;
`;

const Styled = (c) => styled(c)`
  padding: 8px 0;
  background-color: #3570e3;
  width: 100%;

  .MuiSelect-outlined {
    border-color: white !important;

    input {
      border-color: white !important;
    }
  }

  .MuiFormControl-root {
    border-color: white !important;
    margin-right: 16px;
  }

  .MuiSelect-outlined,
  label {
    color: white !important;
  }

  fieldset {
    &,
    &:hover {
      border-color: #ffffff !important;
    }
  }

  svg {
    color: white;
  }

  .MuiSelect-select {
    min-width: 120px;
  }

  label {
    height: 42px !important;
    transform: translate(14px, 14px) scale(1);
  }

  .MuiOutlinedInput-root {
    height: 40px;
  }
`;

function TopNav({ className }: Props) {
  const {
    contexts,
    namespaces,
    currentContext,
    currentNamespace,
  } = useKubernetesContexts();
  const { navigate, currentPage } = useNavigation();

  return (
    <header className={className}>
      <Flex>
        <div>
          <Link
            to={formatURL(PageRoute.Home, currentContext, currentNamespace)}
          >
            <Logo />
          </Link>
        </div>
        <NavWrapper column center wide>
          <Flex center>
            <FormControl variant="outlined">
              <InputLabel>Context</InputLabel>
              {currentContext && contexts.length > 0 && (
                <Select
                  // labelId="context-select-label"
                  id="context-select"
                  onChange={(ev) => {
                    const nextCtx = ev.target.value as string;
                    // setCurrentContext(nextCtx);
                    navigate(
                      getNavValue(currentPage) as PageRoute,
                      nextCtx,
                      currentNamespace
                    );
                  }}
                  value={currentContext}
                >
                  {_.map(contexts, (c) => (
                    <MenuItem value={c.name || ""} key={c.name}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel id="namespaces-selector">Namespace</InputLabel>
              {currentNamespace && namespaces && namespaces.length > 0 && (
                <Select
                  onChange={(ev) => {
                    const nextNs = (ev.target.value === allNamespaces
                      ? AllNamespacesOption
                      : ev.target.value) as string;

                    navigate(
                      getNavValue(currentPage) as PageRoute,
                      currentContext,
                      (nextNs || AllNamespacesOption) as string
                    );
                  }}
                  // Avoid a material-ui warning
                  value={
                    currentNamespace === "all"
                      ? AllNamespacesOption
                      : currentNamespace
                  }
                  id="namespaces-selector"
                  label="Namespace"
                >
                  {_.map(namespaces, (ns) => {
                    const label = ns === "" ? allNamespaces : ns;
                    return (
                      <MenuItem value={label} key={label}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </FormControl>
          </Flex>
        </NavWrapper>
      </Flex>
    </header>
  );
}

export default Styled(TopNav);
