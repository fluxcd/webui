import {
  Box,
  Breadcrumbs,
} from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import ConditionsTable from "../components/ConditionsTable";
import Flex from "../components/Flex";
import KeyValueTable from "../components/KeyValueTable";
import Link from "../components/Link";
import Page from "../components/Page";
import Panel from "../components/Panel";
import { useKubernetesContexts, useNavigation } from "../lib/hooks/app";
import {
  useImagePolicies,
} from "../lib/hooks/image_policies";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};

function ImagePolicyDetail({ className }: Props) {
  const { query } = useNavigation();
  const { currentContext, currentNamespace } = useKubernetesContexts();

  const {
    imagePolicies,
  } = useImagePolicies(currentContext, currentNamespace);
  const imagePolicy = imagePolicies[query.imagePolicyId as string];

  if (!imagePolicy) {
    return null;
  }

  return (
    <Page className={className}>
      <Flex align wide>
        <Breadcrumbs>
          <Link
            to={formatURL(
              PageRoute.ImagePolicies,
              currentContext,
              currentNamespace
            )}
          >
            <h2>Image Policies</h2>
          </Link>
          <Flex wide>
            <h2>{imagePolicy.name}</h2>
          </Flex>
        </Breadcrumbs>
      </Flex>

      <Box marginBottom={2}>
        <Panel title="Info">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Namespace", value: imagePolicy.namespace },
              { key: "ImageRepository", value: <Link
              to={formatURL(
                PageRoute.ImageRepositoryDetail,
                currentContext,
                currentNamespace,
                {
                  imageRepositoryId: imagePolicy.imagerepositoryref,
                }
              )}
            >
              {imagePolicy.imagerepositoryref}
            </Link> },
              { key: "Policy Type", value: imagePolicy.policykind },
              { key: "Policy", value: imagePolicy.policy },
              { key: "Filter Tags Pattern", value: imagePolicy.filtertagspattern },
              { key: "Filter Tags Extract", value: imagePolicy.filtertagsextract },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Status">
          <KeyValueTable
            columns={2}
            pairs={[
              { key: "Latest Image", value: imagePolicy.latestimage },
            ]}
          />
        </Panel>
      </Box>
      <Box marginBottom={2}>
        <Panel title="Conditions">
          <ConditionsTable conditions={imagePolicy.conditions} />
        </Panel>
      </Box>
    </Page>
  );
}

export default styled(ImagePolicyDetail)`
  .MuiBreadcrumbs-root {
    width: 100%;
  }
`;
