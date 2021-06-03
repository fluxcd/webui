import * as d3 from "d3";
import dagreD3 from "dagre-d3";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";

type Props<N> = {
  className?: string;
  nodes: { id: any; data: N; label: (v: N) => string }[];
  edges: { source: any; target: any }[];
  scale?: number;
};

const width = 960;
const height = 960;
// Stolen from here:
// https://dagrejs.github.io/project/dagre-d3/latest/demo/sentence-tokenization.html
function Graph<T>({ className, nodes, edges, scale }: Props<T>) {
  const svgRef = React.useRef(null);

  React.useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    // https://github.com/jsdom/jsdom/issues/2531
    if (process.env.NODE_ENV === "test") {
      return;
    }

    const graph = new dagreD3.graphlib.Graph()
      .setGraph({
        nodesep: 70,
        ranksep: 50,
        rankdir: "LR",
        marginx: 20,
        marginy: 20,
      })
      .setDefaultEdgeLabel(() => {
        return {};
      });

    _.each(nodes, (n) => {
      graph.setNode(n.id, {
        label: n.label(n.data),
        labelType: "html",
        rx: 5,
        ry: 5,
      });
    });

    _.each(edges, (e) => {
      graph.setEdge(e.source, e.target);
    });

    // Create the renderer
    const render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    const svg = d3.select(svgRef.current);
    svg.append("g");

    // Set up zoom support
    const zoom = d3.zoom().on("zoom", (e) => {
      svg.select("g").attr("transform", e.transform);
    });

    svg.call(zoom).call(zoom.transform, d3.zoomIdentity.scale(scale));

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), graph);
  }, [svgRef.current, nodes, edges]);
  return (
    <div className={className}>
      <svg width={width} height={height} ref={svgRef} />
    </div>
  );
}

export default styled(Graph)`
  overflow: hidden;

  text {
    font-weight: 300;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 12px;
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

  foreignObject {
    overflow: visible;
  }
`;
