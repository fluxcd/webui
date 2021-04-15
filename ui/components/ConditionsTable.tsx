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
  conditions: {
    type: string;
    reason: string;
    status: string;
    message: string;
    timestamp: string;
  }[];
};
const Styled = (c) => styled(c)``;

function ConditionsTable({ className, conditions }: Props) {
  return (
    <div className={className}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(conditions, (c) => (
              <TableRow key={c.timestamp}>
                <TableCell>{c.type}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>{c.reason}</TableCell>
                <TableCell>{c.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Styled(ConditionsTable);
