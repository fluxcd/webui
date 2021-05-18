import { Box, CircularProgress } from "@material-ui/core";
import * as React from "react";
import Flex from "./Flex";

type Props = {
  className?: string;
};

export default function LoadingPage({ className }: Props) {
  return (
    <Flex className={className} wide center aling>
      <Box m={8}>
        <CircularProgress />
      </Box>
    </Flex>
  );
}
