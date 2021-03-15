import _ from "lodash";
import * as React from "react";
import styled from "styled-components";

type Props = {
  className?: string;
  lines: string[];
};

const Styled = (c) => styled(c)`
  background-color: #2f2f2f;
  color: white;
  margin: 0;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1.2em;
`;

function CommandLineHint({ className, lines }: Props) {
  return (
    <div className={className}>
      <pre>{_.map(lines, (l) => `${l} \\\n`)}</pre>
    </div>
  );
}

export default Styled(CommandLineHint);
