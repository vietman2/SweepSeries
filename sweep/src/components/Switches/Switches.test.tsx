import { Switch } from "./Switch";
import { renderWithProviders } from "@utils/test-utils";

describe("<Switch />", () => {
  it("renders correctly: on", () => {
    renderWithProviders(<Switch isOn onToggle={jest.fn()} />);
  });

  it("renders correctly: off", () => {
    renderWithProviders(<Switch isOn={false} onToggle={jest.fn()} />);
  });
});
