import { fireEvent } from "@testing-library/react-native";

import { Extras } from "./Extras";
import * as SignupContext from "@contexts/signup";
import * as RegisterAPI from "@services/auth/register";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    dismissAll: jest.fn(),
    replace: jest.fn(),
  },
}));
jest.mock("@contexts/signup", () => ({
  SignupProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useSignup: jest.fn(),
}));

describe("<Extras />", () => {
  beforeEach(() => {
    jest.spyOn(SignupContext, "useSignup").mockReturnValue({
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
    });
    jest.spyOn(RegisterAPI, "register").mockResolvedValue(true);
  });

  it("handles extra information correctly", () => {
    const { getByTestId } = renderWithProviders(<Extras />);

    fireEvent.changeText(getByTestId("닉네임을 입력해주세요."), "nickname");
    fireEvent.changeText(
      getByTestId("생년월일을 입력해주세요. (YYYYMMDD)"),
      "2020-01-01"
    );
    fireEvent.press(getByTestId("남성"));

    fireEvent.press(getByTestId("button"));
  });

  it("handles auto fill", () => {
    jest.spyOn(SignupContext, "useSignup").mockReturnValue({
      setNotificationsAgreed: jest.fn(),
      setUsernameEmail: jest.fn(),
      setPasswords: jest.fn(),
      setNamePhone: jest.fn(),
      mode: "naver",
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
    });

    const { getByTestId } = renderWithProviders(<Extras />);

    fireEvent.changeText(getByTestId("닉네임을 입력해주세요."), "nickname");
    fireEvent.changeText(
      getByTestId("생년월일을 입력해주세요. (YYYYMMDD)"),
      "2020-01-01"
    );
    fireEvent.press(getByTestId("남성"));

    fireEvent.press(getByTestId("button"));
  });

  it("handles register fail", () => {
    jest.spyOn(RegisterAPI, "register").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(<Extras />);

    fireEvent.press(getByTestId("button"));
  });
});
