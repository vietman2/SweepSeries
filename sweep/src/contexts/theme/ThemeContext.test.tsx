import { View, default as RN } from "react-native";

import { ThemeProvider, useTheme } from "./ThemeContext";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@contexts/theme");

const TestComponent = () => {
  const { theme } = useTheme();
  return <View style={{ backgroundColor: theme.background }} />;
};

describe("ThemeProvider", () => {
  it("provides light theme correctly", () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("light");

    renderWithProviders(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
  });

  it("provides dark theme correctly", () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("dark");

    renderWithProviders(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
  });
});
