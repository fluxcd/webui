import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import Link from "../components/Link";
import { useKubernetesContexts, useKustomizations } from "../lib/hooks";
import { Kustomization } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function Kustomizations({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { kustomizations } = useKustomizations(
    currentContext,
    currentNamespace
  );

  const fields: {
    value: string | ((v: any) => JSX.Element | string);
    label: string;
  }[] = [
    {
      value: (k: Kustomization) => (
        <Link
          to={formatURL(
            PageRoute.KustomizationDetail,
            currentContext,
            currentNamespace,
            { kustomizationId: k.name }
          )}
        >
          {k.name}
        </Link>
      ),
      label: "Name",
    },
    {
      label: "Ready",
      value: (k: Kustomization) => {
        const readyCondition = _.find(k.conditions, (c) => c.type === "Ready");
        if (readyCondition) {
          return readyCondition.status;
        }
      },
    },
    {
      label: "Message",
      value: (k: Kustomization) => {
        const readyCondition = _.find(k.conditions, (c) => c.type === "Ready");

        if (readyCondition && readyCondition.status === "False") {
          return readyCondition.message;
        }
      },
    },
  ];

  return (
    <div className={className}>
      <h2>Kustomizations</h2>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {_.map(fields, (f) => (
                <TableCell key={f.label}>{f.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(kustomizations, (k) => (
              <TableRow key={k.name}>
                {_.map(fields, (f) => (
                  <TableCell key={f.label}>
                    {typeof f.value === "function" ? f.value(k) : k[f.value]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Styled(Kustomizations);
