import { ReactElement, PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react-native";

import { AcademyDetailProvider } from "@contexts/academy";
import { AddLessonProvider } from "@contexts/addlesson";
import { AuthProvider } from "@contexts/auth";
import { CalendarProvider } from "@contexts/calendar";
import { FrontProvider } from "@contexts/front";
import { HomeProvider } from "@contexts/home";
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
          <FrontProvider>
            <HomeProvider>
              <AcademyDetailProvider>
                <SignupProvider>
                  <AddLessonProvider>
                    <ThemeProvider>{children}</ThemeProvider>
                  </AddLessonProvider>
                </SignupProvider>
              </AcademyDetailProvider>
            </HomeProvider>
          </FrontProvider>
        </CalendarProvider>
      </AuthProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
