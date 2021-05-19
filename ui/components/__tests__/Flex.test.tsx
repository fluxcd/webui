import "jest-styled-components";
import React from "react";
import renderer from "react-test-renderer";
import Flex from "../Flex";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <Flex wide center align>
        Aligned and Centered!
      </Flex>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
