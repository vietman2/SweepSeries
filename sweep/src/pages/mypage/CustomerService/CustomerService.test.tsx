import { Linking } from "react-native";
import { fireEvent } from "@testing-library/react-native";
import * as Clipboard from "expo-clipboard";

import { CustomerService } from "./CustomerService";
import * as AlertAPI from "@services/alert/alert";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Inquiry", () => ({
  InquirySimple: () => null,
}));

describe("<CustomerService />", () => {
  beforeEach(() => {
    jest.spyOn(Clipboard, "setStringAsync").mockImplementationOnce(jest.fn());
    jest
      .spyOn(AlertAPI, "alert")
      .mockImplementation(
        (title: string, message: string, onPress?: () => void) => {
          if (onPress) {
            onPress();
          }
        }
      );
  });

  it("renders correctly", () => {
    jest.spyOn(Linking, "openURL").mockImplementationOnce(jest.fn());

    const { getByTestId } = renderWithProviders(<CustomerService />);

    fireEvent.press(getByTestId("email"));
    fireEvent.press(getByTestId("copy"));
    fireEvent.press(getByTestId("1:1 문의하기"));
  });
});
