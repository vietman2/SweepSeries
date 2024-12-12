import { fireEvent, waitFor } from "@testing-library/react-native";

import { RegisterCoach } from "./RegisterCoach";
import * as AcademyAPI from "@services/products/academy";
import * as CoachAPI from "@services/products/coach";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

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
      <>
        <TouchableOpacity onPress={() => onChange("asdf")} testID="search" />
        <TouchableOpacity onPress={() => onChange("qwer")} testID="search2" />
      </>
    ),
  };
});

describe("<RegisterCoach />", () => {
  beforeEach(() => {
    jest
      .spyOn(AcademyAPI, "getAcademies")
      .mockResolvedValue({ academies: sampleAcademies });
  });

  it("handles bad responses", async () => {
    jest.spyOn(AcademyAPI, "getAcademies").mockResolvedValueOnce(null);
    jest.spyOn(CoachAPI, "createCoach").mockResolvedValueOnce(null);

    const { getByTestId, getAllByTestId } = renderWithProviders(
      <RegisterCoach />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("search"));
    });

    jest
      .spyOn(AcademyAPI, "getAcademies")
      .mockResolvedValue({ academies: sampleAcademies });

    await waitFor(() => {
      fireEvent.press(getByTestId("search2"));
      fireEvent.press(getByTestId("academy-1"));
      fireEvent.press(getByTestId("reset"));
      fireEvent.press(getByTestId("등록하기"));
    });

    await waitFor(() => {
      fireEvent.press(getByTestId("search"));
      fireEvent.press(getByTestId("academy-1"));
      fireEvent.press(getAllByTestId("image-picker")[0]);
      fireEvent.press(getAllByTestId("image-picker")[1]);
      fireEvent.press(getByTestId("등록하기"));
    });
  });

  it("should handle register correctly", async () => {
    jest.spyOn(CoachAPI, "createCoach").mockResolvedValueOnce({});

    const { getByTestId, getAllByTestId } = renderWithProviders(
      <RegisterCoach />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("career-프로선수 출신"));
      fireEvent.press(getByTestId("profession-투수 전문"));
      fireEvent.press(getByTestId("profession-타격 전문"));
      fireEvent.press(getByTestId("search"));
      fireEvent.press(getByTestId("academy-1"));
      fireEvent.press(getAllByTestId("image-picker")[0]);
      fireEvent.press(getAllByTestId("image-picker")[1]);
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
