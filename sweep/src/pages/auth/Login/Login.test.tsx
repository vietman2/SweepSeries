import { fireEvent, waitFor } from "@testing-library/react-native";
import * as KakaoCore from "@react-native-kakao/core";
import * as KakaoUser from "@react-native-kakao/user";
import NaverLogin from "@react-native-seoul/naver-login";

import { Login } from "./Login";
import * as AuthAPI from "@services/auth/auth";
import { renderWithProviders } from "@utils/test-utils";
import { sampleAuthor } from "@testdata/auth";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));
jest.mock("@react-native-kakao/user", () => ({
  me: jest.fn(),
  login: jest.fn(),
  isLogined: jest.fn(),
}));
jest.mock("@services/alert/alert", () => ({
  alert: jest.fn(),
}));

describe("<Login>", () => {
  beforeEach(() => {
    jest.spyOn(KakaoCore, "initializeKakaoSDK").mockResolvedValue();
    jest.spyOn(NaverLogin, "initialize").mockImplementation();
    jest.spyOn(KakaoUser, "me").mockResolvedValue({
      id: 1234567890,
      email: "email",
      name: "name",
      nickname: "nickname",
      profileImageUrl: "profileImageUrl",
      thumbnailImageUrl: "thumbnailImageUrl",
      phoneNumber: "phoneNumber",
      ageRange: "ageRange",
      birthday: "birthday",
      birthdayType: "birthdayType",
      birthyear: "birthyear",
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
    jest.spyOn(AuthAPI, "naverLogin").mockResolvedValue({
      user: sampleAuthor,
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
  });

  it("handles guest mode", () => {
    const { getByTestId } = renderWithProviders(<Login />);

    fireEvent.press(getByTestId("비회원으로 둘러보기"));
  });

  it("handles Kakao login: first time", async () => {
    jest.spyOn(KakaoUser, "isLogined").mockResolvedValue(false);
    jest.spyOn(KakaoUser, "login").mockResolvedValue({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      accessTokenExpiresAt: 1234567890,
      refreshTokenExpiresAt: 1234567890,
      accessTokenExpiresIn: 1234567890,
      refreshTokenExpiresIn: 1234567890,
      scopes: ["profile"],
    });
    const { getByTestId } = renderWithProviders(<Login />);

    fireEvent.press(getByTestId("kakao-button"));
  });

  it("handles Kakao login: re-login", async () => {
    jest.spyOn(KakaoUser, "isLogined").mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(<Login />);

    fireEvent.press(getByTestId("kakao-button"));
  });

  it("handles Kakao login: error", async () => {
    jest.spyOn(KakaoUser, "isLogined").mockRejectedValue(new Error("error"));

    const { getByTestId } = renderWithProviders(<Login />);

    fireEvent.press(getByTestId("kakao-button"));
  });

  it("handles naver login: success", async () => {
    process.env.EXPO_PUBLIC_KAKAO_APP_KEY = "kakaoAppKey";
    process.env.EXPO_PUBLIC_NAVER_CLIENT_ID = "naverClientId";
    process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET = "naverClientSecret";
    const { getByTestId } = renderWithProviders(<Login />);

    waitFor(() => fireEvent.press(getByTestId("naver-button")));
  });

  it("handles naver login: get profile failure", async () => {
    jest.spyOn(NaverLogin, "getProfile").mockRejectedValue(new Error("error"));

    const { getByTestId } = renderWithProviders(<Login />);

    waitFor(() => fireEvent.press(getByTestId("naver-button")));
  });

  it("handles naver login: no token", async () => {
    jest.spyOn(NaverLogin, "login").mockResolvedValue({
      isSuccess: false,
    });

    const { getByTestId } = renderWithProviders(<Login />);

    waitFor(() => fireEvent.press(getByTestId("naver-button")));
  });

  it("handles naver login: login failure", async () => {
    jest.spyOn(AuthAPI, "naverLogin").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(<Login />);

    waitFor(() => fireEvent.press(getByTestId("naver-button")));
  });
});
