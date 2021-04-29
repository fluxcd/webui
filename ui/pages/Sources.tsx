import { Box } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import Link from "../components/Link";
import Panel from "../components/Panel";
import { SourceType, useKubernetesContexts, useSources } from "../lib/hooks";
import { Source } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)`
  ul {
    list-style: none;
    padding-left: 0;
  }

  .MuiBox-root {
    margin-left: 0;
  }

  .MuiCardContent-root {
    padding-bottom: 16px !important;
  }
`;

const sections = [
  { value: SourceType.Git, label: "Git Repos" },
  { value: SourceType.Bucket, label: "Buckets" },
  { value: SourceType.Helm, label: "Helm Repos" },
];

function Sources({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const sources = useSources(currentContext, currentNamespace);

  return (
    <div className={className}>
      <h2>Sources</h2>
      <div>
        {_.map(sections, (t) => (
          <Box key={t.value} m={2}>
            <Panel title={t.label}>
              <ul>
                {_.map(sources[t.value], (s: Source) => (
                  <li key={`${s.name}/${s.namespace}`}>
                    <Link
                      to={formatURL(
                        PageRoute.SourceDetail,
                        currentContext,
                        currentNamespace,
                        { sourceId: s.name, sourceType: s.type.toLowerCase() }
                      )}
                      params={[t.value, s.name]}
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          </Box>
        ))}
      </div>
    </div>
  );
}

export default Styled(Sources);
