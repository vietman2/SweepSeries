import { TodoSimple } from "./TodoSimple";
import { sampleTodos } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<TodoSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <TodoSimple todo={sampleTodos[0]} />
        <TodoSimple todo={sampleTodos[1]} />
      </>
    );
  });
});
