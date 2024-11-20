import { ReactElement, PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { AuthProvider } from "@contexts/auth";
import { ThemeProvider as MyThemeProvider } from "@contexts/theme";
import { light } from "@themes/themeColors";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "queries"> {
  withRouter?: boolean;
}

export const renderWithProviders = (
  ui: ReactElement,
  { ...renderOptions }: RenderWithProvidersOptions = {
    withRouter: true,
  }
) => {
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return (
      <ThemeProvider theme={{ colors: light }}>
        <MyThemeProvider>
          <AuthProvider>
            {renderOptions.withRouter ? (
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                {children}
              </BrowserRouter>
            ) : (
              children
            )}
          </AuthProvider>
        </MyThemeProvider>
      </ThemeProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
