import { Linking } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Clipboard from "expo-clipboard";

import { CustomerService } from "./CustomerService";
import * as InquiriesAPI from "@services/app/inquiries";
import { sampleInquiries } from "@testdata/customers";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));
jest.mock("@fragments/Inquiry", () => ({
  InquirySimple: () => "InquirySimple",
}));

describe("<CustomerService />", () => {
  beforeEach(() => {
    jest.spyOn(Clipboard, "setStringAsync").mockImplementationOnce(jest.fn());
  });

  it("handles inquiry submit correctly", async () => {
    jest.spyOn(Linking, "openURL").mockImplementationOnce(jest.fn());
    jest
      .spyOn(InquiriesAPI, "getInquiries")
      .mockResolvedValue(sampleInquiries);

    const { getByTestId } = renderWithProviders(<CustomerService />);

    await waitFor(() => {
      expect("InquirySimple").toBeTruthy();
    });

      fireEvent.press(getByTestId("email"));
      fireEvent.press(getByTestId("copy"));
      fireEvent.press(getByTestId("1:1 문의하기"));

    jest.spyOn(InquiriesAPI, "createInquiry").mockResolvedValue(null);

    await waitFor(() => {
      fireEvent.press(getByTestId("문의하기"));
      fireEvent.changeText(getByTestId("title"), {
        target: { value: "title" },
      });
      fireEvent.changeText(getByTestId("content"), {
        target: { value: "content" },
      });
      fireEvent.press(getByTestId("문의하기"));
    });

    jest.spyOn(InquiriesAPI, "createInquiry").mockResolvedValueOnce(true);
    await waitFor(() => fireEvent.press(getByTestId("문의하기")));
  });

  it("handles api error", async () => {
    jest.spyOn(InquiriesAPI, "getInquiries").mockResolvedValueOnce(null);

    renderWithProviders(<CustomerService />);
  });
});
