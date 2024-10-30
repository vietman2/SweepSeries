import { Linking } from "react-native";

import { fireEvent } from "@testing-library/react-native";
import { CustomerService } from "./CustomerService";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Inquiry", () => ({
  InquirySimple: () => null,
}));

describe("<CustomerService />", () => {
  it("renders correctly", () => {
    jest.spyOn(Linking, "openURL").mockImplementationOnce(jest.fn());

    const { getByTestId } = renderWithProviders(<CustomerService />);

    fireEvent.press(getByTestId("email"));
    fireEvent.press(getByTestId("1:1 문의하기"));
  });
});
