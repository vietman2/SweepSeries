import { DatetimeHeader } from "./DatetimeHeader";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("react-native-svg", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: View,
    Line: View,
  };
});

describe("<DatetimeHeader />", () => {
  it("renders correctly", () => {
    renderWithProviders(<DatetimeHeader />);
  });
});
