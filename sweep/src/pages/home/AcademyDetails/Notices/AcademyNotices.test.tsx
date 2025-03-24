import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyNotices } from "./AcademyNotices";
import * as AcademyDetailContext from "@contexts/academy";
import * as NoticesAPI from "@services/products/notices";
import { sampleNotices, sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Notice", () => ({
  NoticeSimple: () => "NoticeSimple",
}));

describe("<AcademyNotices />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: sampleAcademyDetail,
      showDetailPage: false,
      selectCoach: jest.fn(),
      selectNotice: jest.fn(),
    });
  });

  it("renders and handles navigate correctly", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValueOnce(sampleNotices);
    const { getByTestId } = renderWithProviders(<AcademyNotices />);

    await waitFor(() => fireEvent.press(getByTestId("notice-1")));
  });

  it("handles api error", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValueOnce(null);
    renderWithProviders(<AcademyNotices />);

    await waitFor(() => expect("소식이 없습니다.").toBeTruthy());
  });

  it("handles no academy", async () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: null,
      showDetailPage: false,
      selectCoach: jest.fn(),
      selectNotice: jest.fn(),
    });
    renderWithProviders(<AcademyNotices />);
  });
});
