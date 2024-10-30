import { InquirySimple } from "./InquirySimple";
import { sampleInquiries } from "@testdata/customers";
import { renderWithProviders } from "@utils/test-utils";

describe("<InquirySimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <InquirySimple inquiry={sampleInquiries[0]} />
        <InquirySimple inquiry={sampleInquiries[1]} />
      </>
    );
  });
});
