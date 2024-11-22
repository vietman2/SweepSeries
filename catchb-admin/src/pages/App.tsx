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

import { CommunityContainer } from "@pages/Community";
import { Login } from "@pages/Login";

import { RootLayout } from "./_layout";
import { ComingSoon, ErrorComponent } from "@components/Fallbacks";
import { AuthProvider, useAuth } from "@contexts/auth";
import { ThemeProvider, useTheme } from "@contexts/theme";
import { refresh } from "@services/auth";
import { dark, light } from "@themes/themeColors";

const GlobalStyles = createGlobalStyle`
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
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
          <Route path="/users" element={<ComingSoon />} />
          <Route path="/community/*" element={<CommunityContainer />} />
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
