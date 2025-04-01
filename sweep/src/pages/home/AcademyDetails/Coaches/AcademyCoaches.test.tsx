import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyCoaches } from "./AcademyCoaches";
import * as AcademyDetailContext from "@contexts/academy";
import { sampleCoaches } from "@testdata/products";
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
  const defaultContext = {
    academy: null,
    programs: [],
    coaches: sampleCoaches,
    notices: [],
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

  it("renders correctly and handles navigation", async () => {
    const { getByTestId } = renderWithProviders(<AcademyCoaches />);

    await waitFor(() => fireEvent.press(getByTestId("coach-1")));
  });

  it("handles 0 coaches", async () => {
    jest
      .spyOn(AcademyDetailContext, "useAcademyDetail")
      .mockReturnValue({ ...defaultContext, coaches: [] });

    renderWithProviders(<AcademyCoaches />);
  });
});
