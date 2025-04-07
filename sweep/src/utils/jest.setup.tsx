/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

import * as AlertAPI from "@services/alert/alert";

jest
  .spyOn(AlertAPI, "alert")
  .mockImplementation(
    (title: string, message: string, onPress?: () => void) => {
      if (onPress) {
        onPress();
      }
    }
  );

jest.mock("expo-router", () => {
  const { Text, View } = jest.requireActual("react-native");

  return {
    Stack: Object.assign(
      ({
        children,
        screenOptions,
      }: {
        children: React.ReactNode;
        screenOptions: NativeStackNavigationOptions;
      }) => (
        <View>
          {screenOptions.headerLeft && screenOptions.headerLeft({})}
          {children}
        </View>
      ),
      {
        Screen: ({ options }: { options?: NativeStackNavigationOptions }) => (
          <View>
            {options?.headerLeft && options.headerLeft({})}
            <Text>asdf</Text>
          </View>
        ),
      }
    ),
    router: {
      push: jest.fn(),
      back: jest.fn(),
    },
    useLocalSearchParams: jest.fn(),
    usePathname: jest.fn(),
  };
});
jest.mock("react-native-svg/css", () => ({
  SvgCssUri: "SvgCssUri",
}));
jest.mock("@react-native-community/datetimepicker", () => {
  const { TouchableOpacity, View } = jest.requireActual("react-native");

  return {
    __esModule: true,
    default: ({
      onChange,
    }: {
      onChange: (event: any, selectedDate?: Date) => void;
    }) => {
      return (
        <View>
          <TouchableOpacity
            onPress={() => onChange({}, new Date())}
            testID="change-datetime"
          />
          <TouchableOpacity onPress={() => onChange({})} testID="cancel" />
        </View>
      );
    },
    DateTimePickerEvent: jest.fn(),
  };
});
jest.mock("@react-native-async-storage/async-storage", () => {
  const mock = jest.requireActual(
    "@react-native-async-storage/async-storage/jest/async-storage-mock"
  );

  return mock;
});
jest.mock("@react-navigation/material-top-tabs", () => {
  const { View } = jest.requireActual("react-native");
  const actual = jest.requireActual("@react-navigation/material-top-tabs");
  return {
    ...actual,
    createMaterialTopTabNavigator: jest.fn(() => ({
      Navigator: jest.fn(
        ({
          tabBar,
          children,
        }: {
          tabBar: () => React.ReactNode;
          children: React.ReactNode;
        }) => (
          <View>
            {tabBar()}
            {children}
          </View>
        )
      ),
      Screen: ({ component }: { component: () => React.ReactNode }) =>
        component(),
    })),
  };
});
jest.mock("@gorhom/bottom-sheet", () => {
  const { forwardRef } = jest.requireActual("react");

  return {
    __esModule: true,
    default: forwardRef(
      (
        {
          backdropComponent,
          children,
        }: {
          backdropComponent: React.FC<BottomSheetBackdropProps>;
          children: React.ReactNode;
        },
        ref
      ) => (
        <>
          {backdropComponent &&
            backdropComponent({
              animatedIndex: {
                value: 0,
                get: jest.fn(),
                set: jest.fn(),
                modify: jest.fn(),
                addListener: jest.fn(),
                removeListener: jest.fn(),
              },
              animatedPosition: {
                value: 0,
                get: jest.fn(),
                set: jest.fn(),
                modify: jest.fn(),
                addListener: jest.fn(),
                removeListener: jest.fn(),
              },
            })}
          {children}
        </>
      )
    ),
    BottomSheetBackdrop: () => "BottomSheetBackdrop",
    BottomSheetBackdropProps: {},
    BottomSheetScrollView: ({ children }: { children: React.ReactNode }) =>
      children,
    BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock("@quidone/react-native-wheel-picker", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    __esModule: true,
    default: ({
      onValueChanged,
    }: {
      onValueChanged: (event: { item: { value: number } }) => void;
    }) => (
      <TouchableOpacity
        onPress={() => onValueChanged({ item: { value: 1 } })}
        testID="wheel-picker"
      />
    ),
    ValueChangedEvent: jest.fn(),
  };
});
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
  Toggle: ({ onToggle }: { onToggle: () => void }) => {
    const { TouchableOpacity } = jest.requireActual("react-native");

    return <TouchableOpacity onPress={onToggle} testID="toggle" />;
  },
}));
jest.mock("@components/Calendars", () => ({
  CalendarHeader: () => null,
  CustomHeader: () => null,
  CustomDay: () => null,
}));
jest.mock("@components/Checkbox", () => ({
  Checkbox: ({
    text,
    onChange,
    rightPress,
  }: {
    text: string;
    onChange: () => void;
    rightPress: () => void;
  }) => {
    const { TouchableOpacity, View } = jest.requireActual("react-native");

    return (
      <View>
        <TouchableOpacity onPress={onChange} testID={text} />
        <TouchableOpacity onPress={rightPress} testID={`${text}-right`} />
      </View>
    );
  },
}));
jest.mock("@components/Dividers", () => ({
  Divider: () => null,
  VerticalDivider: () => null,
}));
jest.mock("@components/Fallbacks", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    Empty: () => null,
    ErrorPage: ({ onRefresh }: { onRefresh: () => void }) => (
      <TouchableOpacity onPress={onRefresh} testID="error" />
    ),
    LoadingComponent: () => "LoadingComponent",
    LoginNeeded: () => null,
  };
});
jest.mock("@components/Icons", () => ({
  AppIcon: () => null,
  AuthLogo: () => null,
  CustomLogo: () => null,
  MainLogo: () => null,
  HorizontalLogo: () => null,
}));
jest.mock("@components/Images", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    ImagePreview: ({ removeImage }: { removeImage: () => void }) => (
      <TouchableOpacity onPress={removeImage} testID="removeImage" />
    ),
  };
});
jest.mock("@components/Inputs", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    TextInput: ({
      onChangeText,
      placeholder,
    }: {
      onChangeText: (value: string) => void;
      placeholder: string;
    }) => (
      <TouchableOpacity
        testID={placeholder}
        onPress={() => onChangeText(placeholder)}
      />
    ),
  };
});
jest.mock("@components/Menus", () => {
  const { TouchableOpacity, View } = jest.requireActual("react-native");

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
      <View>
        {children}
        {items.map((item) => (
          <TouchableOpacity
            onPress={item.onPress}
            testID={item.label}
            key={item.label}
          />
        ))}
      </View>
    ),
  };
});
jest.mock("@components/Modals", () => {
  const { TouchableOpacity, View } = jest.requireActual("react-native");
  return {
    BaseModal: ({ children }: { children: React.ReactNode }) => children,
    BaseModalWithDismiss: ({
      children,
      onDismiss,
    }: {
      children: React.ReactNode;
      onDismiss: () => void;
    }) => (
      <TouchableOpacity onPress={onDismiss} testID="dismiss-modal">
        {children}
      </TouchableOpacity>
    ),
    SimpleModal: ({
      children,
      buttonText,
      hideModal,
      onButtonPress,
    }: {
      buttonText: string;
      children: React.ReactNode;
      hideModal: () => void;
      onButtonPress: () => void;
    }) => (
      <View>
        <TouchableOpacity testID="hide" onPress={hideModal} />
        <TouchableOpacity testID={buttonText} onPress={onButtonPress} />
        {children}
      </View>
    ),
    SuccessAlert: () => null,
  };
});
jest.mock("@components/Pickers", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  const mockImage = {
    uri: "uri",
    width: 1,
    height: 1,
  };

  return {
    ImagePicker: ({
      setUploadedImages,
    }: {
      setUploadedImages: (
        images: {
          uri: string;
          width: number;
          height: number;
        }[]
      ) => void;
    }) => (
      <TouchableOpacity
        onPress={() => setUploadedImages([mockImage])}
        testID="image-picker"
      />
    ),
  };
});
jest.mock("@components/Progressbars", () => ({
  Progressbar: () => null,
}));
jest.mock("@components/ScrollView", () => {
  const { TouchableOpacity, View } = jest.requireActual("react-native");

  return {
    GSScroll: ({ children }: { children: React.ReactNode }) => children,
    Scroll: ({
      children,
      onScroll,
    }: {
      children: React.ReactNode;
      onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    }) => (
      <TouchableOpacity onScroll={onScroll} testID="scroll">
        {children}
      </TouchableOpacity>
    ),
    ScrollView: ({
      children,
      onRefresh,
    }: {
      children: React.ReactNode;
      onRefresh: () => void;
    }) => (
      <View>
        {children}
        <TouchableOpacity onPress={onRefresh} testID="refresh" />
      </View>
    ),
  };
});
jest.mock("@components/Search", () => {
  const { TouchableOpacity, View } = jest.requireActual("react-native");

  return {
    SearchAddress: ({ onButtonPress }: { onButtonPress: () => void }) => (
      <TouchableOpacity testID="search" onPress={onButtonPress} />
    ),
    Searchbar: ({
      onSubmit,
      onChange,
    }: {
      onSubmit: () => void;
      onChange: (input: string) => void;
    }) => (
      <View>
        <TouchableOpacity onPress={onSubmit} testID="search" />
        <TouchableOpacity onPress={() => onChange("input")} testID="input" />
      </View>
    ),
  };
});
jest.mock("@components/Tabs", () => ({
  CollapsibleTab: () => null,
  FAQTabs: () => null,
  TabBar: jest.fn(() => null),
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
jest.mock("@contexts/academy", () => ({
  AcademyDetailProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAcademyDetail: jest.fn().mockReturnValue({
    academy: null,
    programs: [],
    coaches: [],
    notices: [],
    summary: undefined,
    reviews: [],
    result: undefined,
    loading: false,
    showDetailPage: false,
    selectCoach: jest.fn(),
    selectNotice: jest.fn(),
    refresh: jest.fn(),
  }),
}));
jest.mock("@contexts/addlesson", () => ({
  useAddLesson: jest.fn().mockReturnValue({
    selectedProgram: null,
    selectedStudent: null,
    selectedCurriculum: null,
    selectedCoaches: [],
    selectedStartDateTime: new Date(),
    setProgram: jest.fn(),
    setStudent: jest.fn(),
    setStudentTemp: jest.fn(),
    setSelectedCurriculum: jest.fn(),
    addCoach: jest.fn(),
    setSelectedStartDateTime: jest.fn(),
    handleSubmit: jest.fn(),
  }),
  AddLessonProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: jest.fn().mockReturnValue({
    login: jest.fn(),
    logout: jest.fn(),
    mode: "guest",
    selectedProfile: null,
  }),
}));
jest.mock("@contexts/calendar", () => ({
  CalendarProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useCalendar: jest.fn().mockReturnValue({
    calendars: [],
    isReady: false,
    reloadData: jest.fn(),
    selectedCalendar: null,
    setSelectedCalendar: jest.fn(),
  }),
}));
jest.mock("@contexts/front", () => ({
  FrontProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useFront: jest.fn().mockReturnValue({
    mode: null,
    uuid: "1",
    academies: [],
    coach: undefined,
    headerImage: "",
    headerText: "",
    selectAcademy: jest.fn(),
    selectCoach: jest.fn(),
    refresh: jest.fn(),
  }),
}));
jest.mock("@contexts/home", () => ({
  HomeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useHome: jest.fn().mockReturnValue({
    academy: null,
    selectAcademy: jest.fn(),
  }),
}));
jest.mock("@contexts/review", () => ({
  ReviewProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useReview: jest.fn().mockReturnValue({
    sessionToReview: null,
    tagOptions: undefined,
    setSession: jest.fn(),
  }),
}));
jest.mock("@contexts/signup", () => ({
  SignupProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useSignup: jest.fn().mockReturnValue({
    setNotificationsAgreed: jest.fn(),
    setUsernameEmail: jest.fn(),
    setPasswords: jest.fn(),
    setNamePhone: jest.fn(),
    mode: "catchb",
    user: {
      username: "",
      email: "",
      password: "",
      password2: "",
      name: "",
      phone: "",
    },
    profile: {
      gender: "",
      birthdate: "",
      nickname: "",
      profileImage: "",
    },
    notificationsAgreed: false,
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
jest.mock("@fragments/Author", () => ({
  AuthorProfile: () => null,
}));
jest.mock("@fragments/Post/Report/ReportModal", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");
  return {
    ReportModal: ({
      onSubmit,
    }: {
      onSubmit: (selectedReason: string, detail: string) => void;
    }) => (
      <TouchableOpacity
        testID="report"
        onPress={() => onSubmit("spam", "spam")}
      />
    ),
  };
});
jest.mock("@fragments/SignUp", () => {
  const { TouchableOpacity, View } = jest.requireActual("react-native");

  return {
    SignUpForm: ({
      children,
      buttonOnPress,
    }: {
      children: React.ReactNode;
      buttonOnPress: () => void;
    }) => (
      <View>
        {children}
        <TouchableOpacity onPress={buttonOnPress} testID="button" />
      </View>
    ),
  };
});
jest.mock("@services/alert/alert", () => ({
  alert: jest.fn(),
}));
