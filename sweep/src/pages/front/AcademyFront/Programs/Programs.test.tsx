import { ProgramManagement } from "./Programs";
import * as ProgramsAPI from "@services/products/programs";
import { sampleAcademyPrograms } from "@testdata/products";
import { fireEvent, waitFor } from "@testing-library/react-native";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    setParams: jest.fn(),
  },
}));
jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => "ProgramSimple",
}));

describe("<ProgramManagement />", () => {
  it("renders and handles navigate correctly", async () => {
    jest
      .spyOn(ProgramsAPI, "getPrograms")
      .mockResolvedValue(sampleAcademyPrograms);
    renderWithProviders(<ProgramManagement uuid="1" />);

    await waitFor(() => expect("ProgramSimple").toBeTruthy());
  });

  it("handles bad response and navigate correctly", async () => {
    jest.spyOn(ProgramsAPI, "getPrograms").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(<ProgramManagement uuid="1" />);

    await waitFor(() => fireEvent.press(getByTestId("create")));
  });
});
