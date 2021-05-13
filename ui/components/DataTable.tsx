import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";

type Props = {
  className?: string;
  fields: { label: string; value: string | ((k: any) => string) }[];
  rows: any[];
  rowsPerPage: number;
  count: number;
  onChangePage: (number) => void;
  pageNum: number;
};

const EmptyRow = styled(TableRow)<{ colSpan: number }>`
  font-style: italic;

  td {
    text-align: center;
  }
`;

function DataTable({
  className,
  fields,
  rows,
  count,
  onChangePage,
  rowsPerPage,
  pageNum,
}: Props) {
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onChangePage(newPage);
  };

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
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={fields.length}
                count={count}
                labelRowsPerPage={null}
                rowsPerPage={rowsPerPage}
                page={pageNum}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DataTable;
