import { CoachFront } from "./CoachFront";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@react-navigation/material-top-tabs", () => {
    const { View } = jest.requireActual("react-native");
  const actual = jest.requireActual("@react-navigation/material-top-tabs");
  return {
    ...actual,
    createMaterialTopTabNavigator: jest.fn(() => ({
      Navigator: jest.fn(
        ({
          tabBar,
          children,
        }: {
          tabBar: () => React.ReactNode;
          children: React.ReactNode;
        }) => (
          <View>
            {tabBar()}
            {children}
          </View>
        )
      ),
      Screen: jest.fn(() => null),
    })),
  };
});
jest.mock("./CoachProfile/CoachProfile", () => ({
  CoachProfile: jest.fn(() => null),
}));

describe("<CoachFront />", () => {
  it("should render without crashing", () => {
    renderWithProviders(<CoachFront uuid="uuid" />);
  });
});
