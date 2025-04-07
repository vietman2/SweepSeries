import { fireEvent, waitFor } from "@testing-library/react-native";

import { ProgramManagement } from "./Programs";
import * as ProgramsAPI from "@services/products/programs";
import { sampleAcademyPrograms } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => "ProgramSimple",
}));

describe("<ProgramManagement />", () => {
  it("renders and handles navigate correctly", async () => {
    jest
      .spyOn(ProgramsAPI, "getPrograms")
      .mockResolvedValue(sampleAcademyPrograms);
    const { getByTestId } = renderWithProviders(<ProgramManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      fireEvent.press(getByTestId("program-1"));
    });
  });

  it("handles bad response and navigate correctly", async () => {
    jest.spyOn(ProgramsAPI, "getPrograms").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<ProgramManagement />);

    await waitFor(() => fireEvent.press(getByTestId("create")));
  });
});
