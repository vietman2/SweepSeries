import { fireEvent, waitFor } from "@testing-library/react-native";

import { ProgramManagement } from "./ProgramManagement";
import * as AcademyFrontContext from "@contexts/front";

import { sampleAcademyDetail, sampleAcademyPrograms } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => "ProgramSimple",
}));

describe("<ProgramManagement />", () => {
  const defaultContext = {
    academy: sampleAcademyDetail,
    programs: [],
    notices: [],
    facilityOptions: [],
    loading: false,
    refresh: jest.fn(),
  };

  it("renders and handles navigate correctly", async () => {
    jest
      .spyOn(AcademyFrontContext, "useAcademyFront")
      .mockReturnValue({ ...defaultContext, programs: sampleAcademyPrograms });

    const { getByTestId } = renderWithProviders(<ProgramManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-1"));
      fireEvent.press(getByTestId("create"));
    });
  });

  it("handles no programs", async () => {
    jest
      .spyOn(AcademyFrontContext, "useAcademyFront")
      .mockReturnValue(defaultContext);

    renderWithProviders(<ProgramManagement />);
  });

  it("handles bad config", async () => {
    jest
      .spyOn(AcademyFrontContext, "useAcademyFront")
      .mockReturnValue({ ...defaultContext, academy: null });

    renderWithProviders(<ProgramManagement />);
  });
});
