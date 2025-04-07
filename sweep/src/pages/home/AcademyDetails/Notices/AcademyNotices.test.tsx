import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyNotices } from "./AcademyNotices";
import * as AcademyDetailContext from "@contexts/academy";
import { sampleNotices, sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Notice", () => ({
  NoticeSimple: () => "NoticeSimple",
}));

describe("<AcademyNotices />", () => {
  const defaultContext = {
    academy: sampleAcademyDetail,
    programs: [],
    coaches: [],
    notices: sampleNotices,
    summary: undefined,
    reviews: [],
    result: undefined,
    loading: false,
    showDetailPage: false,
    selectCoach: jest.fn(),
    selectNotice: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(AcademyDetailContext, "useAcademyDetail")
      .mockReturnValue(defaultContext);
  });

  it("renders and handles navigate correctly", async () => {
    const { getByTestId } = renderWithProviders(<AcademyNotices />);

    await waitFor(() => fireEvent.press(getByTestId("notice-1")));
  });

  it("renders empty list", async () => {
    jest
      .spyOn(AcademyDetailContext, "useAcademyDetail")
      .mockReturnValue({...defaultContext, notices: []});

      renderWithProviders(<AcademyNotices />);
  });

  it("handles no academy", async () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      ...defaultContext,
      academy: null,
    });
    renderWithProviders(<AcademyNotices />);
  });
});
