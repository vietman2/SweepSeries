import { fireEvent } from "@testing-library/react-native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { HomeLayout } from "./HomeLayout";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => {
  const { Text, View } = jest.requireActual("react-native");

  return {
    router: {
      back: jest.fn(),
    },
    Stack: Object.assign(
      ({
        children,
        screenOptions,
      }: {
        children: React.ReactNode;
        screenOptions: NativeStackNavigationOptions;
      }) => (
        <View>
          {screenOptions.headerLeft && screenOptions.headerLeft({})}
          {children}
        </View>
      ),
      {
        Screen: ({ options }: { options?: NativeStackNavigationOptions }) => (
          <View>
            {options?.headerLeft && options.headerLeft({})}
            <Text>asdf</Text>
          </View>
        ),
      }
    ),
  };
});

describe("<HomeLayout />", () => {
  it("renders without crashing", () => {
    const { getByTestId } = renderWithProviders(<HomeLayout />);

    fireEvent.press(getByTestId("back-button"));
  });
});
