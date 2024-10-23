import { TextInput } from "./TextInput";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Inputs");

describe("<TextInput>", () => {
  it("renders correctly", () => {
    renderWithProviders(<TextInput value="email" onChangeText={jest.fn()} />);
  });
});
