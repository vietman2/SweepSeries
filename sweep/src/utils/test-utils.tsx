import { ReactElement, PropsWithChildren } from "react";
import { render } from "@testing-library/react-native";
import { ThemeProvider } from "styled-components/native";

import { AcademyDetailProvider } from "@contexts/academy";
import { AddLessonProvider } from "@contexts/addlesson";
import { AuthProvider } from "@contexts/auth";
import { CalendarProvider } from "@contexts/calendar";
import {
  AcademyFrontProvider,
  CoachFrontProvider,
  FrontProvider,
} from "@contexts/front";
import { HomeProvider } from "@contexts/home";
import { SignupProvider } from "@contexts/signup";
import { ThemeProvider as MyThemeProvider } from "@contexts/theme";
import { lightColors } from "@themes/colors";

export const renderWithProviders = (ui: ReactElement) => {
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return (
      <ThemeProvider theme={{ colors: lightColors }}>
        <AuthProvider>
          <CalendarProvider>
            <FrontProvider>
              <AcademyFrontProvider>
                <CoachFrontProvider>
                  <HomeProvider>
                    <AcademyDetailProvider>
                      <SignupProvider>
                        <AddLessonProvider>
                          <MyThemeProvider>{children}</MyThemeProvider>
                        </AddLessonProvider>
                      </SignupProvider>
                    </AcademyDetailProvider>
                  </HomeProvider>
                </CoachFrontProvider>
              </AcademyFrontProvider>
            </FrontProvider>
          </CalendarProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper }) };
};
