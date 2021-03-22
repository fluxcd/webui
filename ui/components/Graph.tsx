import * as d3 from "d3";
import dagreD3 from "dagre-d3";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";

type Props = {
  className?: string;
  nodes: { id: any; text: string }[];
  edges: { source: any; target: any }[];
};
const Styled = (c) => styled(c)`
  g.type-TK > rect {
    fill: #00ffd0;
  }

  text {
    font-weight: 300;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
  }

  .node rect {
    stroke: #999;
    fill: #fff;
    stroke-width: 1.5px;
  }

  .edgePath path {
    stroke: #333;
    stroke-width: 1.5px;
  }
`;

// Stolen from here:
// https://dagrejs.github.io/project/dagre-d3/latest/demo/sentence-tokenization.html
function Graph({ className, nodes, edges }: Props) {
  const svgRef = React.useRef(null);
  React.useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const g = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(function () {
        return {};
      });

    _.each(nodes, (n) => {
      g.setNode(n.id, { label: n.text });
    });

    g.nodes().forEach(function (v) {
      const node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 5;
    });

    _.each(edges, (e) => {
      g.setEdge(e.source, e.target);
    });

    // Create the renderer
    const render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    const svg = d3.select(svgRef.current),
      svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

    // Center the graph
    const xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);
  }, [nodes, edges]);
  return (
    <div className={className}>
      <svg width={960} ref={svgRef} />
    </div>
  );
}

export default Styled(Graph);
