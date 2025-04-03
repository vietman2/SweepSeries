import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademySearch } from "./AcademySearch";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("../AcademySimple/AcademySimple", () => ({
  AcademySimple: () => <div>AcademySimple</div>,
}));

describe("<AcademySearch />", () => {
  it("renders and handles sort and navigation", async () => {
    jest.spyOn(AcademiesAPI, "getAcademies").mockResolvedValue(sampleAcademies);

    const { getByTestId } = renderWithProviders(
      <AcademySearch refreshCount={0} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("sort-button"));
      fireEvent.press(getByTestId("sort-item-인기순"));
      fireEvent.press(getByTestId("academy-detail-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(AcademiesAPI, "getAcademies").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(
      <AcademySearch refreshCount={0} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("sort-button"));
    });
  });
});
