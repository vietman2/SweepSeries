import { View, default as RN } from "react-native";
import { render } from "@testing-library/react-native";

import { ThemeProvider, useTheme } from "./ThemeContext";

jest.unmock("@contexts/theme");

const TestComponent = () => {
  const { theme } = useTheme();
  return <View style={{ backgroundColor: theme.background }} />;
};

describe("ThemeProvider", () => {
  it("provides light theme correctly", () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("light");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
  });

  it("provides dark theme correctly", () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
  });
});
