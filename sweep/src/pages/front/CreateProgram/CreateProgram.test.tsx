import { fireEvent, waitFor } from "@testing-library/react-native";

import { CreateProgram } from "./CreateProgram";
import * as ProgramsAPI from "@services/products/programs";
import {
  sampleProgramPositions,
  sampleProgramTargets,
} from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({ uuid: "uuid" })),
}));

describe("<CreateProgram />", () => {
  beforeEach(() => {
    jest
      .spyOn(ProgramsAPI, "getTargets")
      .mockResolvedValue(sampleProgramTargets);
    jest
      .spyOn(ProgramsAPI, "getPositions")
      .mockResolvedValue(sampleProgramPositions);
  });

  it("handles create correctly", async () => {
    jest.spyOn(ProgramsAPI, "createProgram").mockResolvedValue({});
    const { getByTestId } = renderWithProviders(<CreateProgram />);

    await waitFor(() => {
      fireEvent.press(getByTestId("60분"));
      fireEvent.press(getByTestId("120분"));
      fireEvent.press(getByTestId("투수레슨"));
      fireEvent.press(getByTestId("타격레슨"));
      fireEvent.press(getByTestId("선수반"));
      fireEvent.press(getByTestId("사회인야구반"));
      fireEvent.press(getByTestId("plus"));
      fireEvent.press(getByTestId("delete-button1"));
      fireEvent.press(getByTestId("delete-button0"));
      fireEvent.changeText(getByTestId("수업 수"), "");
      fireEvent.changeText(getByTestId("수업 수"), "8");
      fireEvent.changeText(getByTestId("가격"), "800000");
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("handles create fail", async () => {
    jest.spyOn(ProgramsAPI, "createProgram").mockResolvedValue(null);
    const { getByTestId, getByText } = renderWithProviders(<CreateProgram />);

    await waitFor(() => expect(getByText("투수레슨")).toBeTruthy());

      fireEvent.press(getByTestId("저장"));
  });

  it("handles bad initialization", async () => {
    jest.spyOn(ProgramsAPI, "getTargets").mockResolvedValue(null);
    jest.spyOn(ProgramsAPI, "getPositions").mockResolvedValue(null);
    jest.spyOn(ProgramsAPI, "createProgram").mockResolvedValue({});
    renderWithProviders(<CreateProgram />);
  });
});
