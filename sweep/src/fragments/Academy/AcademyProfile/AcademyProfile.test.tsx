import { fireEvent } from "@testing-library/react-native";

import { AcademyProfile } from "./AcademyProfile";
import { renderWithProviders } from "@utils/test-utils";
import { sampleAcademyDetail } from "@testdata/products";

describe("<AcademyProfile />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AcademyProfile academy={sampleAcademyDetail} />);
  });

  it("renders pro mode and handles image modal correctly", () => {
    const { getByTestId } = renderWithProviders(
      <AcademyProfile academy={{ ...sampleAcademyDetail, images: [] }} pro />
    );

    fireEvent.press(getByTestId("open-modal"));
    fireEvent.press(getByTestId("hide"));
    fireEvent.press(getByTestId("open-modal"));
    fireEvent.press(getByTestId("저장하기"));
  });
});
