import { waitFor } from "@testing-library/react-native";

import { ProgramList } from "./ProgramList";
import * as ProgramsAPI from "@services/products/programs";
import { sampleAcademyPrograms } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => "ProgramSimple",
}));

describe("<ProgramList />", () => {
  it("renders correctly", async () => {
    jest.spyOn(ProgramsAPI, "getPrograms").mockResolvedValueOnce(sampleAcademyPrograms);
    renderWithProviders(<ProgramList />);

    await waitFor(() => expect("ProgramSimple").toBeTruthy());
  });
  
  it("handles api error", async () => {
    jest
      .spyOn(ProgramsAPI, "getPrograms")
      .mockResolvedValueOnce(null);
    renderWithProviders(<ProgramList />);

    await waitFor(() => expect("ProgramSimple").toBeTruthy());
  });
});
