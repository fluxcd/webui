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
import { useHelmReleases, useKubernetesContexts } from "../lib/hooks";
import { HelmRelease } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function HelmRelease({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const helmReleases = useHelmReleases(currentContext, currentNamespace);

  const fields: {
    value: string | ((w: any) => JSX.Element);
    label: string;
  }[] = [
    {
      value: (h: HelmRelease) => (
        <Link
          to={formatURL(
            PageRoute.HelmReleaseDetail,
            currentContext,
            currentNamespace,
            { helmReleaseId: h.name }
          )}
        >
          {h.name}
        </Link>
      ),
      label: "Name",
    },
  ];

  return (
    <div className={className}>
      <h2>Helm Releases</h2>
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
            {_.map(helmReleases, (k) => (
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

export default Styled(HelmRelease);
