import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider, useTheme } from './ThemeContext';
import { renderWithProviders } from '@utils/test-utils';

jest.unmock('@contexts/theme/ThemeContext');

const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <span>{`Dark mode is ${isDarkMode ? "on" : "off"}`}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('<ThemeProvider />', () => {
  const Child = () => <div>Children</div>;

  it('should render children', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ThemeProvider>
                <Child />
              </ThemeProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    expect(getByText('Children')).toBeInTheDocument();
  });

  it("should initialize with light mode (isDarkMode = false)", () => {
    renderWithProviders(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText("Dark mode is off")).toBeInTheDocument();
  });

  it("should toggle between light and dark mode", () => {
    renderWithProviders(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByText("Toggle Theme");

    // Initial state should be light mode (isDarkMode = false)
    expect(screen.getByText("Dark mode is off")).toBeInTheDocument();

    // Toggle to dark mode
    act(() => {
      toggleButton.click();
    });
    expect(screen.getByText("Dark mode is on")).toBeInTheDocument();

    // Toggle back to light mode
    act(() => {
      toggleButton.click();
    });
    expect(screen.getByText("Dark mode is off")).toBeInTheDocument();
  });

  it("should throw an error when useTheme is used outside of ThemeProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Test component that uses the useTheme hook outside of the ThemeProvider
    const InvalidComponent = () => {
      useTheme();
      return null;
    };

    // Expect error to be thrown
    expect(() => render(<InvalidComponent />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );

    spy.mockRestore();
  });
});
