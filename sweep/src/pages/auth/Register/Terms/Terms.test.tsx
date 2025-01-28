import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { Terms } from "./Terms";
import * as SignupContext from "@contexts/signup";
import * as AgreementsAPI from "@services/auth/agreements";
import { sampleAgreements } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

describe("<Terms />", () => {
  beforeEach(() => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ mode: "catchb" });
    jest
      .spyOn(AgreementsAPI, "getAgreements")
      .mockResolvedValue(sampleAgreements);
  });

  it("renders and handles presses correctly", async () => {
    const { getByTestId } = renderWithProviders(<Terms />);

    await waitFor(() => {
      expect(getByTestId("(필수) 약관 1")).toBeTruthy();
    });

    fireEvent.press(getByTestId("모두 동의 합니다."));
    fireEvent.press(getByTestId("모두 동의 합니다."));

    await waitFor(() => {
      fireEvent.press(getByTestId("button"));
    });
  });

  it("handles social mode", async () => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ mode: "kakao" });
    jest.spyOn(SignupContext, "useSignup").mockReturnValue({
      setNotificationsAgreed: jest.fn(),
      setUsernameEmail: jest.fn(),
      setPasswords: jest.fn(),
      setNamePhone: jest.fn(),
      mode: "kakao",
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

    const { getByTestId } = renderWithProviders(<Terms />);

    await waitFor(() => {
      fireEvent.press(getByTestId("(필수) 약관 1"));
      fireEvent.press(getByTestId("(필수) 약관 1-right"));
      fireEvent.press(getByTestId("(선택) 알림 수신 동의"));
      fireEvent.press(getByTestId("button"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(AgreementsAPI, "getAgreements").mockResolvedValue(null);

    renderWithProviders(<Terms />);
  });
});
