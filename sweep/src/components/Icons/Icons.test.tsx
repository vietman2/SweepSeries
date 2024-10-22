import { render } from "@testing-library/react-native";

import { AppIcon } from "./AppIcon";

jest.unmock("@components/Icons");

describe("<AppIcon />", () => {
  it("renders correctly", () => {
    render(<AppIcon icon="home" color="black" size={24} />);
  });
  
  it("renders default size correctly", () => {
    render(<AppIcon icon="home" color="black" />);
  });
});
