import { fireEvent } from "@testing-library/react-native";

import { AcademyProfile } from "./AcademyProfile";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./LogoModal", () => ({
  LogoModal: () => "LogoModal",
}));

describe("<AcademyProfile />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademyProfile academy={sampleAcademyDetail} />);
  });

  it("renders pro mode and handles image modal correctly", () => {
    const { getByTestId } = renderWithProviders(
      <AcademyProfile academy={{ ...sampleAcademyDetail, images: [] }} pro />
    );

    fireEvent.press(getByTestId("open-image-modal"));
    fireEvent.press(getByTestId("hide"));
    fireEvent.press(getByTestId("open-image-modal"));
    fireEvent.press(getByTestId("저장하기"));
  });

  it("handles logo modal correctly", () => {
    const { getByTestId } = renderWithProviders(
      <AcademyProfile academy={sampleAcademyDetail} pro onRefresh={jest.fn()} />
    );

    fireEvent.press(getByTestId("open-logo-modal"));
  });
});
