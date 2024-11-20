import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

import { AuthProvider, useAuth } from "@contexts/auth";
import { ThemeProvider, useTheme } from "@contexts/theme";
import { dark, light } from "@themes/themeColors";

function Placeholder() {
  return <div>Placeholder</div>;
}

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Placeholder />} />
      <Route path="/login" element={<Placeholder />} />
      <Route path="/protected" element={<ProtectedRoutes />} />
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

const GlobalStyles = createGlobalStyle`
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
        <ThemedApp />
      </ThemeProvider>
    </>
  );
}

function ThemedApp() {
  const { isDarkMode } = useTheme();

  return (
    <StyledThemeProvider theme={{ colors: isDarkMode ? dark : light }}>
      <AuthProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </AuthProvider>
    </StyledThemeProvider>
  );
}
