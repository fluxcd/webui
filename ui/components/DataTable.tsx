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
  fields: { label: string; value: string | ((k: any) => string) }[];
  rows: any[];
};

const EmptyRow = styled(TableRow)<{ colSpan: number }>`
  font-style: italic;

  td {
    text-align: center;
  }
`;
const Styled = (c) => styled(c)``;

function DataTable({ className, fields, rows }: Props) {
  const r = _.map(rows, (r, i) => (
    <TableRow key={i}>
      {_.map(fields, (f) => (
        <TableCell key={f.label}>
          {typeof f.value === "function" ? f.value(r) : r[f.value]}
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <div className={className}>
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
            {r.length > 0 ? (
              r
            ) : (
              <EmptyRow colSpan={fields.length}>
                <TableCell colSpan={fields.length}>
                  <span style={{ fontStyle: "italic" }}>No rows</span>
                </TableCell>
              </EmptyRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Styled(DataTable);
