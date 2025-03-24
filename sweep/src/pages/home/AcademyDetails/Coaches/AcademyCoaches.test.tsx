import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyCoaches } from "./AcademyCoaches";
import * as AcademyDetailContext from "@contexts/academy";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoaches, sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Coach", () => ({
  CoachSimple: () => <></>,
}));

describe("<AcademyCoaches />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: sampleAcademyDetail,
      showDetailPage: false,
      selectCoach: jest.fn(),
      selectNotice: jest.fn(),
    });
  });

  it("renders correctly and handles navigation", async () => {
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);
    const { getByTestId } = renderWithProviders(<AcademyCoaches />);

    await waitFor(() => fireEvent.press(getByTestId("coach-1")));
  });

  it("handles bad response", async () => {
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(null);
    const { getByText } = renderWithProviders(<AcademyCoaches />);

    await waitFor(() =>
      expect(getByText("등록된 코치가 아직 없습니다.")).toBeTruthy()
    );
  });

  it("handles no academy", async () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: null,
      showDetailPage: false,
      selectCoach: jest.fn(),
      selectNotice: jest.fn(),
    });
    renderWithProviders(<AcademyCoaches />);
  });
});
