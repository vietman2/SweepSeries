import { fireEvent } from "@testing-library/react-native";

import { AddTodo } from "./AddTodo";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Schedule", () => ({
  ScheduleInput: () => <></>,
}));

describe("<AddTodo />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(<AddTodo />);

    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("cancel"));
  });
});
