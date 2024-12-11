import { fireEvent, waitFor } from "@testing-library/react-native";

import { Introduction } from "./Introduction";
import * as AcademiesAPI from "@services/products/academy";
import { renderWithProviders } from "@utils/test-utils";

describe("<Introduction />", () => {
  it("renders correctly", async () => {
    const { getByTestId } = renderWithProviders(
      <Introduction introduction="Introduction" />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("expand-button"));
      fireEvent.press(getByTestId("expand-button"));
    });
  });

  it("handles update correctly", async () => {
    jest
      .spyOn(AcademiesAPI, "updateAcademyIntroduction")
      .mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(
      <Introduction introduction="Introduction" edit onRefresh={jest.fn()} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("hide"));
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("handles update fail", async () => {
    jest
      .spyOn(AcademiesAPI, "updateAcademyIntroduction")
      .mockResolvedValueOnce(null);
    const { getByTestId } = renderWithProviders(
      <Introduction introduction="Introduction" edit />
    );

    // 1. bad response
    await waitFor(() => {
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("저장"));
    });

    // 2. no refresh
    jest
      .spyOn(AcademiesAPI, "updateAcademyIntroduction")
      .mockResolvedValueOnce(true);

    await waitFor(() => {
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("저장"));
    });
  });
});
