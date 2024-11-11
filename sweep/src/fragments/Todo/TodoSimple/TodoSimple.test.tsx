import { fireEvent } from "@testing-library/react-native";

import { TodoSimple } from "./TodoSimple";
import { sampleTodos } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<TodoSimple />", () => {
  it("renders correctly and handle toggle", () => {
    const { getAllByTestId } = renderWithProviders(
      <>
        <TodoSimple todo={sampleTodos[0]} />
        <TodoSimple todo={sampleTodos[1]} />
      </>
    );

    fireEvent.press(getAllByTestId("toggle")[0]);
  });
});
