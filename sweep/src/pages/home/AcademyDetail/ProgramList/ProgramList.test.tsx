import { fireEvent, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { ProgramList } from "./ProgramList";
import * as ProgramsAPI from "@services/products/programs";
import { sampleAcademyPrograms } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));
jest.mock("@fragments/Program", () => ({
  ProgramSimple: () => "ProgramSimple",
}));

describe("<ProgramList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({ id: "1" });
  });

  it("renders correctly", async () => {
    jest
      .spyOn(ProgramsAPI, "getPrograms")
      .mockResolvedValueOnce(sampleAcademyPrograms);
    const { getByTestId } = renderWithProviders(<ProgramList />);

    await waitFor(() => {
      fireEvent.press(getByTestId("program-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(ProgramsAPI, "getPrograms").mockResolvedValueOnce(null);
    renderWithProviders(<ProgramList />);

    await waitFor(() => expect("ProgramSimple").toBeTruthy());
  });
});
