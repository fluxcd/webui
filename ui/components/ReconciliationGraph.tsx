import { CircularProgress } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import _ from "lodash";
import * as React from "react";
import { renderToString } from "react-dom/server";
import styled from "styled-components";
import { UnstructuredObjectWithParent } from "../lib/hooks/kustomizations";
import { UnstructuredObject } from "../lib/rpc/clusters";
import Graph from "./Graph";

export interface Props {
  objects: UnstructuredObjectWithParent[];
  parentObject: any;
  parentObjectKind: string;
  className?: string;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Current":
      return <CheckCircleIcon color="primary" />;

    case "InProgress":
      return <CircularProgress size={16} />;

    default:
      return "";
  }
}

const NodeHtml = ({ object }) => {
  return (
    <div className="node">
      <div className="kind">
        <div>{object.groupversionkind.kind}</div>
        <div className="status">{getStatusIcon(object.status)}</div>
      </div>
      <div className="name">
        {object.namespace} / {object.name}
      </div>
    </div>
  );
};

function ReconciliationGraph({
  className,
  objects,
  parentObject,
  parentObjectKind,
}: Props) {
  const edges = _.reduce(
    objects,
    (r, v) => {
      if (v.parentUid) {
        r.push({ source: v.parentUid, target: v.uid });
      } else {
        r.push({ source: parentObject.name, target: v.uid });
      }
      return r;
    },
    []
  );

  const nodes = [
    ..._.map(objects, (r) => ({
      id: r.uid,
      data: r,
      label: (u: UnstructuredObject) => renderToString(<NodeHtml object={u} />),
    })),
    {
      id: parentObject.name,
      data: parentObject,
      label: (u: Props["parentObject"]) =>
        renderToString(
          <NodeHtml
            object={{ ...u, groupversionkind: { kind: parentObjectKind } }}
          />
        ),
    },
  ];
  return (
    <div className={className}>
      <Graph scale={1} nodes={nodes} edges={edges} />
    </div>
  );
}

export default styled(ReconciliationGraph)`
  ${Graph} {
    background-color: #f5f5f5;
  }

  .node {
    font-size: 14px;
    background-color: white;
  }

  rect {
    filter: drop-shadow(2px 2px 2px #7c7c7c);
  }

  .kind {
    display: flex;
    width: 100%;
    justify-content: space-between;
    color: black;
  }

  .status {
    height: 24px;
    width: 24px;
    font-size: 12px;
  }

  .Current {
    color: green;
  }

  .name {
    color: #3570e3;
  }

  .MuiSvgIcon-root {
    height: 16px;
    width: 16px;
    float: right;
  }
`;
