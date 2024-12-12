import { fireEvent, waitFor } from "@testing-library/react-native";

import { CoachList } from "./CoachList";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoaches } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({ id: "1" })),
}));
jest.mock("@fragments/Coach", () => ({
  CoachSimple: () => <></>,
}));

describe("<CoachList />", () => {
  it("renders correctly and handles navigation", async () => {
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);
    const { getByTestId } = renderWithProviders(<CoachList />);

    await waitFor(() => fireEvent.press(getByTestId("coach-1")));
  });

  it("handles bad response", async () => {
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(null);
    const { getByText } = renderWithProviders(<CoachList />);

    await waitFor(() =>
      expect(getByText("등록된 코치가 아직 없습니다.")).toBeTruthy()
    );
  });
});
