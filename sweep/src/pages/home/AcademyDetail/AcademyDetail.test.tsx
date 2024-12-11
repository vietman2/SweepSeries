import { waitFor } from "@testing-library/react-native";

import { AcademyDetail } from "./AcademyDetail";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./CoachList/CoachList", () => ({
  CoachList: () => "CoachList",
}));
jest.mock("./Information/Information", () => ({
  Information: () => "Information",
}));
jest.mock("./NoticeList/NoticeList", () => ({
  NoticeList: () => "NoticeList",
}));
jest.mock("./ProgramList/ProgramList", () => ({
  ProgramList: () => "ProgramList",
}));
jest.mock("./ReviewList/ReviewList", () => ({
  ReviewList: () => "ReviewList",
}));
jest.mock("@fragments/Academy", () => ({
  AcademyProfile: () => "AcademyProfile",
}));

describe("<AcademyDetail />", () => {
  it("renders correctly", () => {
    jest
      .spyOn(AcademiesAPI, "getAcademyDetail")
      .mockResolvedValue(sampleAcademyDetail);
    waitFor(() => renderWithProviders(<AcademyDetail />));
  });

  it("handles error correctly", async () => {
    jest.spyOn(AcademiesAPI, "getAcademyDetail").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<AcademyDetail />);

    await waitFor(() => expect(getByTestId("error")).toBeTruthy());
  });
});
