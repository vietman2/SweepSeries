import { Sort } from "./Sort";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Sorts");

describe("<Sort />", () => {
  test("renders correctly", () => {
    renderWithProviders(
      <Sort
        options={["option1", "option2"]}
        selectedOption="option1"
        onSelect={jest.fn()}
      />
    );
  });
});
