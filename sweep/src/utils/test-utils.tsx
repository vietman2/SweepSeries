import { ReactElement, PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react-native";

import { AuthProvider } from "@contexts/auth";
import { CalendarProvider } from "@contexts/calendar";
import { SignupProvider } from "@contexts/signup";
import { ThemeProvider } from "@contexts/theme";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "queries"> {}

export const renderWithProviders = (
  ui: ReactElement,
  { ...renderOptions }: RenderWithProvidersOptions = {}
) => {
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return (
      <AuthProvider>
        <CalendarProvider>
          <SignupProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </SignupProvider>
        </CalendarProvider>
      </AuthProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
