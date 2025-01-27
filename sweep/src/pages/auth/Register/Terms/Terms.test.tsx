import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { Terms } from "./Terms";
import * as SignupContext from "@contexts/signup";
import { sampleAgreements } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));
jest.mock("@contexts/signup", () => ({
  SignupProvider: ({ children }: { children: React.ReactNode }) => children,
  useSignup: jest.fn(),
}));

describe("<Terms />", () => {
  beforeEach(() => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ mode: "catchb" });
  });

  it("renders and handles presses correctly", async () => {
    jest.spyOn(SignupContext, "useSignup").mockReturnValue({
      terms: sampleAgreements,
      checkedTerms: sampleAgreements.map((agreement) => ({
        id: agreement.id,
        checked: false,
        required: agreement.required,
      })),
      setCheck: jest.fn(),
      checkAll: jest.fn(),
      setUsernameEmail: jest.fn(),
      setPasswords: jest.fn(),
      setNamePhone: jest.fn(),
      signup: jest.fn(),
    });

    const { getByTestId } = renderWithProviders(<Terms />);

    await waitFor(() => {
      fireEvent.press(getByTestId("모두 동의 합니다."));
      fireEvent.press(getByTestId("모두 동의 합니다."));
      fireEvent.press(getByTestId("button"));
    });
  });

  it("handles social mode", async () => {
    jest
      .spyOn(Router, "useLocalSearchParams")
      .mockReturnValue({ mode: "kakao" });

    const { getByTestId } = renderWithProviders(<Terms />);

    await waitFor(() => {
      fireEvent.press(getByTestId("(필수) 약관 1"));
      fireEvent.press(getByTestId("(필수) 약관 1-right"));
      fireEvent.press(getByTestId("button"));
    });
  });

  it("handles error correctly", async () => {
    waitFor(() => renderWithProviders(<Terms />));
  });
});
