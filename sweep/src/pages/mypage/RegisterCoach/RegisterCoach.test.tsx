import { fireEvent, waitFor } from "@testing-library/react-native";

import { RegisterCoach } from "./RegisterCoach";
import * as AcademyAPI from "@services/products/academy";
import * as CoachAPI from "@services/products/coach";
import { renderWithProviders } from "@utils/test-utils";
import { sampleAcademies } from "@testdata/products";

jest.mock("expo-router", () => ({
  router: {
    dismissAll: jest.fn(),
    push: jest.fn(),
  },
}));
jest.mock("@components/Search", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    Searchbar: ({ onChange }: { onChange: (query: string) => void }) => (
      <TouchableOpacity onPress={() => onChange("asdf")} testID="search" />
    ),
  };
});

describe("<RegisterCoach />", () => {
  beforeEach(() => {
    jest
      .spyOn(AcademyAPI, "getAcademies")
      .mockResolvedValue({ academies: sampleAcademies });
  });

  it("should handle bad response", async () => {
    jest.spyOn(AcademyAPI, "getAcademies").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(<RegisterCoach />);

    await waitFor(() => {
      fireEvent.press(getByTestId("search"));
    });
  });

  it("should handle register correctly", async () => {
    jest.spyOn(CoachAPI, "createCoach").mockResolvedValueOnce({});

    const { getByTestId } = renderWithProviders(<RegisterCoach />);

    await waitFor(() => {
      fireEvent.press(getByTestId("career-프로선수 출신"));
      fireEvent.press(getByTestId("profession-투수 전문"));
      fireEvent.press(getByTestId("profession-타격 전문"));
      fireEvent.press(getByTestId("search"));
      fireEvent.press(getByTestId("academy-1"));
      fireEvent.press(getByTestId("image-picker"));
      fireEvent.press(getByTestId("등록하기"));
    });
  });

  it("handle bad response", async () => {
    jest.spyOn(CoachAPI, "createCoach").mockResolvedValueOnce(null);

    const { getByTestId } = renderWithProviders(<RegisterCoach />);

    await waitFor(() => {
      fireEvent.press(getByTestId("search"));
      fireEvent.press(getByTestId("academy-1"));
      fireEvent.press(getByTestId("image-picker"));
      fireEvent.press(getByTestId("등록하기"));
    });
  });

  it("handles register failure (no academy)", async () => {
    const { getByTestId } = renderWithProviders(<RegisterCoach />);

    await waitFor(() => {
      fireEvent.press(getByTestId("search"));
      fireEvent.press(getByTestId("academy-1"));
      fireEvent.press(getByTestId("reset"));
      fireEvent.press(getByTestId("등록하기"));
    });
  });

  it("handles register failure (no image)", async () => {
    const { getByTestId } = renderWithProviders(<RegisterCoach />);

    await waitFor(() => {
      fireEvent.press(getByTestId("search"));
      fireEvent.press(getByTestId("academy-1"));
      fireEvent.press(getByTestId("등록하기"));
    });
  });
});
