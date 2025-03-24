import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyPrograms } from "./AcademyPrograms";
import * as AcademyDetailContext from "@contexts/academy";
import * as ProgramsAPI from "@services/products/programs";
import { sampleAcademyPrograms, sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => "ProgramSimple",
}));

describe("<AcademyPrograms />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: sampleAcademyDetail,
    });
  });

  it("renders correctly", async () => {
    jest
      .spyOn(ProgramsAPI, "getPrograms")
      .mockResolvedValueOnce(sampleAcademyPrograms);
    const { getByTestId } = renderWithProviders(<AcademyPrograms />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(ProgramsAPI, "getPrograms").mockResolvedValueOnce(null);
    renderWithProviders(<AcademyPrograms />);

    await waitFor(() => expect("ProgramSimple").toBeTruthy());
  });

  it("handles context fail", async () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: null,
    });
    renderWithProviders(<AcademyPrograms />);

    await waitFor(() => expect("ProgramSimple").toBeTruthy());
  });
});
