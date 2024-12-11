import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

import { AcademyContainer } from "@pages/Academies";
import { AppsContainer } from "@pages/Apps";
import { CoachContainer } from "@pages/Coaches";
import { CommunityContainer } from "@pages/Community";
import { Login } from "@pages/Login";
import { MembersContainer } from "@pages/Members";

import { RootLayout } from "./_layout";
import { ComingSoon, ErrorComponent } from "@components/Fallbacks";
import { AuthProvider, useAuth } from "@contexts/auth";
import { ThemeProvider, useTheme } from "@contexts/theme";
import { refresh } from "@services/auth";
import { dark, light } from "@themes/themeColors";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Freesentation';
    src: url('/assets/fonts/Freesentation100.woff2') format('woff2'),
    font-display: fallback;
    font-style: normal;
    font-weight: 100;
  }

  @font-face {
    font-family: 'Freesentation';
    src: url('/assets/fonts/Freesentation200.woff2') format('woff2'),
    font-display: fallback;
    font-style: normal;
    font-weight: 200;
  }

  @font-face {
    font-family: 'Freesentation';
    src: url('/assets/fonts/Freesentation300.woff2') format('woff2'),
    font-display: fallback;
    font-style: normal;
    font-weight: 300;
  }

  @font-face {
    font-family: 'Freesentation';
    src: url('/assets/fonts/Freesentation400.woff2') format('woff2'),
    font-display: fallback;
    font-style: normal;
    font-weight: 400;
  }

  @font-face {
    font-family: 'Freesentation';
    src: url('/assets/fonts/Freesentation500.woff2') format('woff2'),
    font-display: fallback;
    font-style: normal;
    font-weight: 500;
  }

  @font-face {
    font-family: 'Freesentation';
    src: url('/assets/fonts/Freesentation600.woff2') format('woff2'),
    font-display: fallback;
    font-style: normal;
    font-weight: 600;
  }

  @font-face {
    font-family: 'Freesentation';
    src: url('/assets/fonts/Freesentation700.woff2') format('woff2'),
    font-display: fallback;
    font-style: normal;
    font-weight: 700;
  }

  @font-face {
    font-family: 'Freesentation';
    src: url('/assets/fonts/Freesentation800.woff2') format('woff2'),
    font-display: fallback;
    font-style: normal;
    font-weight: 800;
  }

  @font-face {
    font-family: 'Freesentation';
    src: url('/assets/fonts/Freesentation900.woff2') format('woff2'),
    font-display: fallback;
    font-style: normal;
    font-weight: 900;
  }

  * {
    box-sizing: border-box;
  }
    
  button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }

  div {
    transition: background-color 0.3s ease-in-out;
  }

  body {
    margin: 0;
    font-family: 'Freesentation', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

export default function App() {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

function AppRouter() {
  const [ready, setReady] = useState<boolean>(false);

  const { isAuthenticated, login } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const refreshToken = async () => {
      const response = await refresh();
      if (response) {
        login(response.access);
      }

      setReady(true);
    };

    refreshToken();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route element={<RootLayout />}>
          <Route path="/home" element={<ComingSoon />} />
          <Route path="/members/*" element={<MembersContainer />} />
          <Route path="/community/*" element={<CommunityContainer />} />
          <Route path="/apps/*" element={<AppsContainer />} />
          <Route path="/academies/*" element={<AcademyContainer />} />
          <Route path="/coaches/*" element={<CoachContainer />} />
          <Route path="/*" element={<ErrorComponent />} />
        </Route>
      </>
    ),
    {
      future: {
        v7_skipActionErrorRevalidation: true,
        v7_partialHydration: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_relativeSplatPath: true,
      },
    }
  );

  if (!ready) {
    return null;
  }

  return (
    <StyledThemeProvider theme={{ colors: isDarkMode ? dark : light }}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </StyledThemeProvider>
  );
}
