import { fireEvent } from "@testing-library/react-native";
import KakaoLogin from "@react-native-kakao/user";
import NaverLogin from "@react-native-seoul/naver-login";

import { Landing } from "./Landing";
import * as AuthContext from "@contexts/auth";
import * as AuthAPI from "@services/auth/auth";
import { sampleAuthor } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  Redirect: jest.fn(),
}));
jest.mock("@react-native-kakao/user", () => ({
  me: jest.fn(),
  login: jest.fn(),
  isLogined: jest.fn(),
}));
jest.mock("@contexts/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: jest.fn(),
}));

describe("<Landing />", () => {
  beforeEach(() => {
    jest.spyOn(KakaoLogin, "isLogined").mockResolvedValue(false);
    jest.spyOn(KakaoLogin, "login").mockResolvedValue({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      accessTokenExpiresAt: 1234567890,
      refreshTokenExpiresAt: 1234567890,
      accessTokenExpiresIn: 1234567890,
      refreshTokenExpiresIn: 1234567890,
      scopes: ["scopes"],
    });
    jest.spyOn(KakaoLogin, "me").mockResolvedValue({
      id: 1,
      email: "email",
      name: "name",
      nickname: "nickname",
      profileImageUrl: "profile_image",
      thumbnailImageUrl: "thumbnail_image",
      phoneNumber: "phone_number",
      ageRange: "age_range",
      birthday: "birthday",
      birthdayType: "birthday_type",
      birthyear: "2000",
      gender: "gender",
      isEmailValid: true,
      isEmailVerified: true,
      isKorean: true,
    });
    jest.spyOn(NaverLogin, "login").mockResolvedValue({
      isSuccess: true,
      successResponse: {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        expiresAtUnixSecondString: "1234567890",
        tokenType: "tokenType",
      },
    });
    jest.spyOn(NaverLogin, "getProfile").mockResolvedValue({
      resultcode: "resultcode",
      message: "message",
      response: {
        id: "id",
        nickname: "nickname",
        email: "email",
        name: "name",
        birthday: "birthday",
        age: "age",
        birthyear: 2000,
        gender: "gender",
        mobile: "mobile",
        mobile_e164: "mobile_e164",
        profile_image: "profile_image",
      },
    });
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      selectedProfile: null,
      logout: jest.fn(),
      mode: "guest",
    });
  });

  it("handles redirects", () => {
    const { getByTestId } = renderWithProviders(<Landing />);

    fireEvent.press(getByTestId("이메일로 로그인"));
    fireEvent.press(getByTestId("이메일로 가입하기"));
    fireEvent.press(getByTestId("비회원으로 둘러보기"));
  });

  it("handles Social login: success", () => {
    jest.spyOn(AuthAPI, "socialLogin").mockResolvedValue({
      user: sampleAuthor,
    });

    const { getByTestId } = renderWithProviders(<Landing />);

    fireEvent.press(getByTestId("naver-button"));
    fireEvent.press(getByTestId("kakao-button"));
  });

  it("handles Social login: redirect", () => {
    jest.spyOn(AuthAPI, "socialLogin").mockResolvedValue("REDIRECT");

    const { getByTestId } = renderWithProviders(<Landing />);

    fireEvent.press(getByTestId("naver-button"));
    fireEvent.press(getByTestId("kakao-button"));
  });

  it("handles Social login: rediirect (no autofill)", () => {
    jest.spyOn(KakaoLogin, "me").mockResolvedValue({
      id: 1,
      email: "email",
      name: "",
      nickname: "",
      profileImageUrl: "",
      thumbnailImageUrl: "thumbnail_image",
      phoneNumber: "phone_number",
      ageRange: "age_range",
      birthday: "",
      birthdayType: "birthday_type",
      birthyear: "",
      gender: "",
      isEmailValid: true,
      isEmailVerified: true,
      isKorean: true,
    });
    jest.spyOn(NaverLogin, "getProfile").mockResolvedValue({
      resultcode: "resultcode",
      message: "message",
      response: {
        id: "id",
        nickname: "",
        email: "email",
        name: "name",
        birthday: "",
        age: "age",
        birthyear: null,
        gender: "",
        mobile: "",
        mobile_e164: "mobile_e164",
        profile_image: "",
      },
    });
    jest.spyOn(AuthAPI, "socialLogin").mockResolvedValue("REDIRECT");

    const { getByTestId } = renderWithProviders(<Landing />);

    fireEvent.press(getByTestId("naver-button"));
    fireEvent.press(getByTestId("kakao-button"));
  });

  it("handles Social login: bad catchb server", () => {
    jest.spyOn(AuthAPI, "socialLogin").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(<Landing />);

    fireEvent.press(getByTestId("naver-button"));
    fireEvent.press(getByTestId("kakao-button"));
  });

  it("handles Kakao login: error", () => {
    jest.spyOn(KakaoLogin, "isLogined").mockResolvedValue(true);
    jest.spyOn(KakaoLogin, "me").mockRejectedValue(new Error("error"));

    const { getByTestId } = renderWithProviders(<Landing />);

    fireEvent.press(getByTestId("kakao-button"));
  });

  it("handles Naver login: naver get profile fail", () => {
    jest.spyOn(NaverLogin, "getProfile").mockRejectedValue(new Error("error"));

    const { getByTestId } = renderWithProviders(<Landing />);

    fireEvent.press(getByTestId("naver-button"));
  });

  it("handles Naver login: naver no token", () => {
    jest.spyOn(NaverLogin, "login").mockResolvedValue({
      isSuccess: false,
    });

    const { getByTestId } = renderWithProviders(<Landing />);

    fireEvent.press(getByTestId("naver-button"));
  });

  it("handles auto login", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: jest.fn(),
      selectedProfile: sampleAuthor,
      logout: jest.fn(),
      mode: "normal",
    });
    renderWithProviders(<Landing />);
  });
});
