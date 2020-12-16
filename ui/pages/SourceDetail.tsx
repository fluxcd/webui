import * as React from "react";
import _ from "lodash";
import { useParams } from "react-router";
import styled from "styled-components";
import { SourceType, useSources } from "../lib/hooks";

type Props = {
  className?: string;
};

function isHTTP(uri) {
  return uri.includes("http") || uri.includes("https");
}

function convertRefURLToGitProvider(uri: string) {
  if (isHTTP(uri)) {
    return uri;
  }

  const [, provider, org, repo] = uri.match(/git@(.*)\/(.*)\/(.*)/);

  return `https://${provider}/${org}/${repo}`;
}

const Styled = (c) => styled(c)``;

function SourceDetail({ className }: Props) {
  const { sourceType, sourceId } = useParams<{
    sourceType: SourceType;
    sourceId: string;
  }>();
  const sources = useSources(sourceType);
  const sourceDetail = _.find(sources, { name: sourceId });

  if (!sourceDetail) {
    return null;
  }

  const providerUrl = convertRefURLToGitProvider(sourceDetail.url);

  return (
    <div className={className}>
      <h2>{sourceDetail.name}</h2>
      <p>{sourceDetail.url}</p>
      <p>
        <a href={providerUrl}>Provider Link</a>
      </p>
    </div>
  );
}

export default Styled(SourceDetail);
