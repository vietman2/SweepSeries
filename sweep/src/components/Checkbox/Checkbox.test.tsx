import { Checkbox } from "./Checkbox";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Checkbox");

describe("<Checkbox />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <Checkbox
          text="Checkbox"
          checked={false}
          onChange={jest.fn()}
          rightPress={jest.fn()}
        />
        <Checkbox
          text="Checkbox"
          checked={true}
          onChange={jest.fn()}
          rightPress={jest.fn()}
          grayText
        />
      </>
    );
  });
});
