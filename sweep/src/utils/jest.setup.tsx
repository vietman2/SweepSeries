/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock("react-native-svg/css", () => ({
  SvgCssUri: "SvgCssUri",
}));
jest.mock("@components/Buttons", () => ({
  SvgIconButton: ({ icon, onPress }: { icon: string; onPress: () => void }) => {
    const { TouchableOpacity } = jest.requireActual("react-native");

    return <TouchableOpacity onPress={onPress} testID={icon} />;
  },
  KakaoButton: ({ onPress }: { onPress: () => void }) => {
    const { TouchableOpacity } = jest.requireActual("react-native");

    return <TouchableOpacity onPress={onPress} testID="kakao-button" />;
  },
  NaverButton: ({ onPress }: { onPress: () => void }) => {
    const { TouchableOpacity } = jest.requireActual("react-native");

    return <TouchableOpacity onPress={onPress} testID="naver-button" />;
  },
  Link: () => null,
  TextButton: ({ text, onPress }: { text: string; onPress: () => void }) => {
    const { TouchableOpacity } = jest.requireActual("react-native");

    return <TouchableOpacity onPress={onPress} testID={text} />;
  },
}));
jest.mock("@components/Dividers", () => ({
  Divider: () => null,
  VerticalDivider: () => null,
}));
jest.mock("@components/Fallbacks", () => ({
  LoadingComponent: () => null,
  LoginNeeded: () => null,
}));
jest.mock("@components/Icons", () => ({
  AppIcon: () => null,
  MainLogo: () => null,
  HorizontalLogo: () => null,
}));
jest.mock("@components/Inputs", () => ({
  TextInput: () => null,
}));
jest.mock("@components/ScrollView", () => ({
  GSScroll: () => null,
  Scroll: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: () => ({
    login: jest.fn(),
    logout: jest.fn(),
    token: "token",
  }),
}));
jest.mock("@contexts/theme", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useTheme: () => ({
    theme: {},
    colorScheme: "light",
  }),
}));
