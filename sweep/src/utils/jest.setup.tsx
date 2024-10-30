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
jest.mock("@components/Calendars", () => ({
  CalendarHeader: () => null,
}));
jest.mock("@components/Dividers", () => ({
  Divider: () => null,
  VerticalDivider: () => null,
}));
jest.mock("@components/Fallbacks", () => ({
  Empty: () => null,
  ErrorPage: () => null,
  LoadingComponent: () => null,
  LoginNeeded: () => null,
}));
jest.mock("@components/Filters", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    Filters: ({ onSelect }: { onSelect: (filter: string) => void }) => {
      return (
        <TouchableOpacity onPress={() => onSelect("asdf")} testID="filter" />
      );
    },
  };
});
jest.mock("@components/Icons", () => ({
  AppIcon: () => null,
  MainLogo: () => null,
  HorizontalLogo: () => null,
}));
jest.mock("@components/Inputs", () => {
  const { TextInput } = jest.requireActual("react-native");

  return {
    TextInput: ({ placeholder }: { placeholder: string }) => (
      <TextInput testID={placeholder} />
    ),
  };
});
jest.mock("@components/Menus", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    PopupMenu: ({
      items,
      children,
    }: {
      items: {
        label: string;
        onPress: () => void;
      }[];
      children: React.ReactNode;
    }) => (
      <>
        {children}
        {items.map((item) => (
          <TouchableOpacity
            onPress={item.onPress}
            testID={item.label}
            key={item.label}
          />
        ))}
      </>
    ),
  };
});
jest.mock("@components/Progressbars", () => ({
  Progressbar: () => null,
}));
jest.mock("@components/ScrollView", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    GSScroll: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Scroll: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    ScrollView: ({
      children,
      onRefresh,
    }: {
      children: React.ReactNode;
      onRefresh: () => void;
    }) => (
      <>
        {children}
        <TouchableOpacity onPress={onRefresh} testID="refresh" />
      </>
    ),
  };
});
jest.mock("@components/Search", () => ({
  Searchbar: ({ onSubmit }: { onSubmit: () => void }) => {
    const { TouchableOpacity } = jest.requireActual("react-native");

    return <TouchableOpacity onPress={onSubmit} testID="search" />;
  },
}));
jest.mock("@components/Tabs", () => ({
  Tabbar: () => null,
}));
jest.mock("@components/Texts", () => {
  const { Text } = jest.requireActual("react-native");

  return {
    InputTitle: () => null,
    CalloutSmall: () => null,
    CalloutLarge: () => null,
    Text,
  };
});
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
