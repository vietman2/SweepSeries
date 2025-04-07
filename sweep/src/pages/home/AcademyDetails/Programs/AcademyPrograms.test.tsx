import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyPrograms } from "./AcademyPrograms";
import * as AcademyDetailContext from "@contexts/academy";
import { sampleAcademyPrograms } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => "ProgramSimple",
}));

describe("<AcademyPrograms />", () => {
  const defaultContext = {
    academy: null,
    programs: sampleAcademyPrograms,
    coaches: [],
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
  });

  it("renders correctly", async () => {
    jest
      .spyOn(AcademyDetailContext, "useAcademyDetail")
      .mockReturnValue(defaultContext);

    const { getByTestId } = renderWithProviders(<AcademyPrograms />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-1"));
    });
  });

  it("renders empty list", async () => {
    jest
      .spyOn(AcademyDetailContext, "useAcademyDetail")
      .mockReturnValue({ ...defaultContext, programs: [] });

    renderWithProviders(<AcademyPrograms />);
  });
});
