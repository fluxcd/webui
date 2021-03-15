import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { SourceType, useKubernetesContexts } from "../lib/hooks";
import { clustersClient } from "../lib/util";
import CommandLineHint from "./CommandLineHint";
import Flex from "./Flex";

type Props = {
  className?: string;
  workloadName: string;
};

const StyledSelect = styled(Select)``;

const Number = styled.div`
  border-radius: 50%;
  background-color: #adadad;
  height: 40px;
  width: 40px;
  margin-right: 16px;

  ${Flex} {
    height: 100%;
  }
`;

const Styled = (c) => styled(c)`
  input {
    min-width: 300px;
  }
`;

type FormValues = {
  name: string;
  sourceUrl: string;
  yamlPath: string;
  sourceType: SourceType;
};

const sourceIsCreated = (
  sourceName: string,
  contextName: string,
  sourceType: SourceType
) =>
  clustersClient
    .listSources({
      contextname: contextName,
      namespace: "flux-system",
      sourcetype: sourceType,
    })
    .then((res) => {
      const s = _.find(res.sources, { name: sourceName });

      return !!s;
    });

const kustomizationIsCreated = (
  kustomizationName: string,
  contextName: string
) =>
  clustersClient
    .listKustomizations({
      contextname: contextName,
      namespace: "flux-system",
    })
    .then((res) => {
      const k = _.find(res.kustomizations, { name: kustomizationName });

      return !!k;
    });

function WorkloadOnboardingHints({ className, workloadName }: Props) {
  const [sourceCreated, setSourceCreated] = React.useState(false);
  const [kustomizationCreated, setKustomizationCreated] = React.useState(false);

  const [formValues, setFormValues] = React.useState<FormValues>({
    name: workloadName,
    sourceType: SourceType.Git,
    sourceUrl: "",
    yamlPath: "./clusters",
  } as FormValues);
  const { currentContext } = useKubernetesContexts();

  const sourceCheck = async () => {
    const created = await sourceIsCreated(
      formValues.name,
      currentContext,
      formValues.sourceType
    );

    if (created) {
      setSourceCreated(true);
    }
  };

  const kustomizationCheck = async () => {
    const created = await kustomizationIsCreated(
      formValues.name,
      currentContext
    );

    if (created) {
      setKustomizationCreated(true);
    }
  };

  React.useEffect(() => {
    // Check for source on initial render
    sourceCheck();

    let interval;
    if (!sourceCreated) {
      // Check every 5 seconds and clear if source is found
      interval = setInterval(() => {
        sourceCheck();
      }, 5000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [sourceCreated]);

  React.useEffect(() => {
    if (!sourceCreated) {
      // Don't do anything if a source isn't created yet
      return;
    }
    kustomizationCheck();

    let interval;
    if (!kustomizationCreated) {
      interval = setInterval(() => {
        if (kustomizationCreated) {
          clearInterval(interval);
        } else {
          kustomizationCheck();
        }
      }, 5000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [sourceCreated, kustomizationCreated]);

  return (
    <div className={className}>
      <Box paddingBottom={4}>
        <FormControl variant="outlined">
          <Flex wide>
            <Box marginBottom={2} marginRight={4}>
              <TextField
                variant="outlined"
                label="Name"
                value={formValues.name}
                onChange={(e) =>
                  setFormValues({ ...formValues, name: e.target.value })
                }
              />
            </Box>
            <Box marginRight={4}>
              <StyledSelect
                onChange={(e) => {
                  setFormValues({
                    ...formValues,
                    sourceType: e.target.value as SourceType,
                  });
                }}
                value={formValues.sourceType}
              >
                <MenuItem value={SourceType.Git}>{SourceType.Git}</MenuItem>
                <MenuItem value={SourceType.Bucket}>
                  {SourceType.Bucket}
                </MenuItem>
                <MenuItem value={SourceType.Helm}>{SourceType.Helm}</MenuItem>
              </StyledSelect>
            </Box>
          </Flex>
          <Flex>
            <Box marginRight={4}>
              <TextField
                variant="outlined"
                label="Source URL"
                value={formValues.sourceUrl}
                onChange={(e) =>
                  setFormValues({ ...formValues, sourceUrl: e.target.value })
                }
              />
            </Box>
            <Box marginRight={4}>
              <TextField
                variant="outlined"
                label="Clusters YAML Path"
                value={formValues.yamlPath}
                onChange={(e) =>
                  setFormValues({ ...formValues, yamlPath: e.target.value })
                }
              />
            </Box>
          </Flex>
        </FormControl>
      </Box>

      <div>
        <Flex align>
          <Number style={{ backgroundColor: sourceCreated ? "green" : "gray" }}>
            <Flex className="full-height" align center>
              1
            </Flex>
          </Number>
          <h4>Create a source</h4>
        </Flex>
        <div>
          <CommandLineHint
            lines={[
              `flux create source ${
                formValues.sourceType || `<source type>`
              } ${workloadName}`,
              `  --url=${formValues.sourceUrl || `<source url>`}`,
              `  --branch=master`,
              `  --interval=30s`,
              `  --export > ${
                formValues.yamlPath || `<yaml path>`
              }/${workloadName}-source.yaml`,
            ]}
          />
        </div>
      </div>
      <div>
        <Flex align>
          <Number>
            <Flex align center>
              2
            </Flex>
          </Number>
          <h4>Create a Kustomization</h4>
        </Flex>
        <div>
          <CommandLineHint
            lines={[
              `flux create kustomization ${workloadName}`,
              `  --source=${workloadName}`,
              `  --path="./kustomize"`,
              `  --prune=true`,
              `  --validation=client`,
              `  --interval=5m`,
              `  --export > ${
                formValues.yamlPath || `<yaml path>`
              }/${workloadName}-kustomization.yaml`,
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default Styled(WorkloadOnboardingHints);
