import { render } from "@testing-library/react-native";

import { MainButton } from "./MainButton";

jest.unmock("@components/Buttons");

describe("<MainButton />", () => {
  it("renders correctly", () => {
    render(<MainButton icon="icon" text="Press me" />);
  });
});
