import { TouchableOpacity, View } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import * as Router from "expo-router";

import { SignupProvider, useSignup } from "./SignupContext";

jest.unmock("@contexts/signup");

const TestComponent = () => {
  const {
    setNotificationsAgreed,
    setUsernameEmail,
    setPasswords,
    setNamePhone,
  } = useSignup();

  return (
    <View>
      <TouchableOpacity
        onPress={() => setNotificationsAgreed(true)}
        testID="check-noti"
      />
      <TouchableOpacity
        onPress={() => setUsernameEmail("username", "email")}
        testID="set-username-email"
      />
      <TouchableOpacity
        onPress={() => setPasswords("qwer1234", "qwer1234")}
        testID="set-passwords"
      />
      <TouchableOpacity
        onPress={() => setNamePhone("name", "phone")}
        testID="set-name-phone"
      />
    </View>
  );
};

describe("<SignupProvider />", () => {
  const commonParams = {
    username: "username",
    email: "email",
    name: "name",
    phone: "phone",
    nickname: "nickname",
    profileImage: "profileImage",
  };

  const emptyParams = {
    username: "",
    email: "",
    name: "",
    phone: "",
    birthday: "",
    birthyear: "",
    gender: "",
    nickname: "",
    profileImage: "",
  };

  it("renders and updates checked terms correctly (catchb)", () => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({
      mode: "catchb",
    });

    const { getByTestId } = render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>
    );

    fireEvent.press(getByTestId("check-noti"));
    fireEvent.press(getByTestId("set-username-email"));
    fireEvent.press(getByTestId("set-passwords"));
    fireEvent.press(getByTestId("set-name-phone"));
  });

  it("handles params correctly (kakao)", () => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({
      mode: "kakao",
      birthday: "0101",
      birthyear: "1990",
      gender: "female",
      ...commonParams,
    });

    render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>
    );
  });

  it("handles params correctly (naver)", () => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({
      mode: "naver",
      birthday: "01-01",
      birthyear: "1990",
      gender: "F",
      ...commonParams,
    });

    render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>
    );
  });

  it("handles params correctly (kakao) 2", () => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({
      mode: "kakao",
      ...emptyParams,
    });

    render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>
    );
  });

  it("handles params correctly (naver) 2", () => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({
      mode: "naver",
      ...emptyParams,
    });

    render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>
    );
  });

  it("handles misuse", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });
});
