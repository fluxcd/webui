import { Box } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import Link from "../components/Link";
import LoadingPage from "../components/LoadingPage";
import Page from "../components/Page";
import Panel from "../components/Panel";
import { useKubernetesContexts } from "../lib/hooks/app";
import { SourceType, useSources } from "../lib/hooks/sources";
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
  { value: SourceType.Git, label: "Git Repositories" },
  { value: SourceType.Bucket, label: "Buckets" },
  { value: SourceType.Helm, label: "Helm Repositories" },
];

function Sources({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { sources, loading } = useSources(currentContext, currentNamespace);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Page className={className}>
      <h2>Sources</h2>
      <div>
        {_.map(sections, (t) => (
          <Box key={t.value} m={2}>
            <Panel title={t.label}>
              <ul>
                {_.map(sources[t.value], (s) => (
                  <li key={s.name}>
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
    </Page>
  );
}

export default Styled(Sources);
