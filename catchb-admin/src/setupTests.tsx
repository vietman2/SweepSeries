// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import { MenuOptionType } from "@models/app";
import { SubTabType } from "@navigation/tabs";

jest.mock("react-color-palette", () => ({
  ColorPicker: () => <div>ColorPicker</div>,
  ColorService: {
    convert: jest.fn(),
  },
  useColor: (color: string) => [color, jest.fn()],
}));
jest.mock("react-color-palette/css", () => ({}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock("@components/Dividers", () => ({
  Divider: () => <div>Divider</div>,
  VerticalDivider: () => <div>VerticalDivider</div>,
}));
jest.mock("@components/Fallbacks", () => ({
  ComingSoon: () => <div>ComingSoon</div>,
  ErrorComponent: ({
    onRefresh,
    label,
  }: {
    onRefresh: () => void;
    label: string;
  }) => <button onClick={onRefresh}>{label}</button>,
  Loading: () => <div>Loading</div>,
}));
jest.mock("@components/Icons", () => ({
  AppIcon: ({ icon }: { icon: string }) => <span>{icon}</span>,
  MainLogo: () => <div>MainLogo</div>,
  ProfileIcon: () => <div>ProfileIcon</div>,
}));
jest.mock("@components/Inputs", () => {
  const { forwardRef } = jest.requireActual("react");

  const mockRef = jest.fn().mockImplementation(() => {
    return { current: { getEditor: jest.fn(() => ({ getText: jest.fn() })) } };
  });

  return {
    ContentInput: forwardRef(() => (
      <div ref={mockRef} data-testid="content" />
    )),
    TextInput: ({
      placeholder,
      value,
      onChange,
    }: {
      placeholder: string;
      value: string;
      onChange: (value: string) => void;
    }) => (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`textinput-${placeholder}`}
      />
    ),
  };
});
jest.mock("@components/Menus", () => ({
  Menu: ({
    options,
    toggleDropdown,
  }: {
    options: MenuOptionType[];
    toggleDropdown: () => void;
  }) => (
    <div>
      {options.map((option) => (
        <button key={option.label} onClick={option.onClick}>
          {option.label}
        </button>
      ))}
      <button onClick={toggleDropdown} data-testid="toggle" />
    </div>
  ),
}));
jest.mock("@components/Modals", () => ({
  SimpleModal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("@components/Tabs", () => ({
  HeaderTabs: ({
    tabs,
    setActiveTab,
  }: {
    tabs: SubTabType[];
    setActiveTab: (tab: SubTabType) => void;
  }) => (
    <>
      {tabs.map((tab) => (
        <button key={tab.path} onClick={() => setActiveTab(tab)}>
          {tab.title}
        </button>
      ))}
    </>
  ),
}));

jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: () => ({
    login: jest.fn(),
    setToken: jest.fn(),
    logout: jest.fn(),
  }),
}));
jest.mock("@contexts/theme", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useTheme: () => ({
    toggleTheme: jest.fn(),
    isDarkMode: false,
  }),
}));
jest.mock("@pages/_layout", () => ({
  RootLayout: () => <div>RootLayout</div>,
  ContentLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
