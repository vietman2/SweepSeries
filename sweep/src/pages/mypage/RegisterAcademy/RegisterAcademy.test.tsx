import { fireEvent, waitFor } from "@testing-library/react-native";

import { RegisterAcademy } from "./RegisterAcademy";
import * as AcademyAPI from "@services/products/academy";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    dismissAll: jest.fn(),
    push: jest.fn(),
  },
}));
jest.mock("@actbase/react-daum-postcode", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    __esModule: true,
    default: ({
      onSelected,
      onError,
    }: {
      onSelected: () => void;
      onError: () => void;
    }) => (
      <>
        <TouchableOpacity testID="done" onPress={onSelected} />
        <TouchableOpacity testID="error" onPress={onError} />
      </>
    ),
  };
});
jest.mock("@actbase/react-daum-postcode/lib/types", () => ({
  OnCompleteParams: "OnCompleteParams",
}));

describe("<RegisterAcademy />", () => {
  it("should handle register correctly", async () => {
    jest.spyOn(AcademyAPI, "createAcademy").mockResolvedValueOnce({});

    const { getByTestId, getAllByTestId } = renderWithProviders(
      <RegisterAcademy />
    );

    await waitFor(() => {
      fireEvent.changeText(
        getByTestId("아카데미 이름을 입력해주세요."),
        "아카데미 이름"
      );
      fireEvent.changeText(
        getByTestId("아카데미 전화번호를 입력해주세요."),
        "01012345678"
      );
      fireEvent.changeText(
        getByTestId("사업자 등록번호를 입력해주세요."),
        "1234567890"
      );
      fireEvent.press(getByTestId("search"));
      fireEvent.press(getByTestId("done"));
      fireEvent.press(getByTestId("search"));
      fireEvent.press(getByTestId("error"));
      fireEvent.press(getAllByTestId("image-picker")[0]);
      fireEvent.press(getAllByTestId("image-picker")[1]);
      fireEvent.press(getByTestId("등록하기"));
    });
  });

  it("handles button press without images and bad response", async () => {
    jest.spyOn(AcademyAPI, "createAcademy").mockResolvedValueOnce(null);

    const { getByTestId, getAllByTestId } = renderWithProviders(
      <RegisterAcademy />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("등록하기"));
      fireEvent.press(getAllByTestId("image-picker")[0]);
      fireEvent.press(getAllByTestId("image-picker")[1]);
      fireEvent.press(getByTestId("등록하기"));
    });
  });
});
