import { AddTodo } from "./AddTodo";
import { renderWithProviders } from "@utils/test-utils";

describe("<AddTodo />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AddTodo />);
  });
});
