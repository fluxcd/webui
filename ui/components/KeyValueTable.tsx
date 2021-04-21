import _ from "lodash";
import * as React from "react";
import styled from "styled-components";

type Props = {
  className?: string;
  pairs: { key: string; value: string }[];
  columns: number;
  overrides?: {
    [keyName: string]: Array<React.ReactElement | string>;
  };
};

const Key = styled.div`
  font-weight: bold;
`;

const Value = styled.div``;

const Styled = (c) => styled(c)`
  table {
    width: 100%;
  }

  tr {
    height: 64px;
  }
`;

function KeyValueTable({ className, pairs, columns, overrides }: Props) {
  const arr = new Array(Math.ceil(pairs.length / columns))
    .fill(null)
    .map(() => pairs.splice(0, columns));

  return (
    <div role="list" className={className}>
      <table>
        <tbody>
          {_.map(arr, (a, i) => (
            <tr key={i}>
              {_.map(a, ({ key, value }) => {
                let k = key;
                let v = value;
                const override = overrides ? overrides[key] : null;

                if (override) {
                  v = override[0] as string;
                  k = override[1] as string;
                }

                const label = _.startCase(k);

                return (
                  <td role="listitem" key={key}>
                    <Key aria-label={label}>{label}</Key>
                    <Value>
                      {v || <span style={{ marginLeft: 2 }}>-</span>}
                    </Value>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Styled(KeyValueTable);
