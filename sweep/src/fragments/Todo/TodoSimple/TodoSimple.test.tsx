import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { TodoSimple } from "./TodoSimple";
import { sampleTodos } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<TodoSimple />", () => {
  it("renders correctly and handle toggle", async () => {
    const toggleSuccess = jest.fn().mockResolvedValue(true);
    const toggleFail = jest.fn().mockResolvedValue(false);

    const { getAllByTestId } = renderWithProviders(
      <>
        <TodoSimple todo={sampleTodos[0]} onPress={toggleSuccess} />
        <TodoSimple todo={sampleTodos[1]} onPress={toggleFail} />
      </>
    );

    await waitFor(() => {
      fireEvent.press(getAllByTestId("toggle")[0]);
      fireEvent.press(getAllByTestId("toggle")[1]);
    });
  });
});
