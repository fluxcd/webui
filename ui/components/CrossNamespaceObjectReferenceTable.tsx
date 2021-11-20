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

type Props = {
  className?: string;
  crossNamespaceObjectReference: {
    apiVersion: string;
    kind: string;
    name: string;
    namespace: string;
  }[];
};
const Styled = (c) => styled(c)``;

function CrossNamespaceObjectReferenceTable({ className, crossNamespaceObjectReference }: Props) {
  return (
    <div className={className}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>API version</TableCell>
              <TableCell>Kind</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Namespace</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(crossNamespaceObjectReference, (cnor) => (
              <TableRow>
                <TableCell>{cnor.apiVersion}</TableCell>
                <TableCell>{cnor.kind}</TableCell>
                <TableCell>{cnor.name}</TableCell>
                <TableCell>{cnor.namespace}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Styled(CrossNamespaceObjectReferenceTable);
