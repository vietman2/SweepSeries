import { fireEvent } from "@testing-library/react-native";

import { AcademyProfile } from "./AcademyProfile";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./ImagesModal", () => ({
  ImagesModal: () => "ImagesModal",
}));
jest.mock("./LogoModal", () => ({
  LogoModal: () => "LogoModal",
}));

describe("<AcademyProfile />", () => {
  it("renders normal mode correctly", () => {
    renderWithProviders(<AcademyProfile academy={sampleAcademyDetail} />);
  });

  it("handles pro mode modals correctly and no images", () => {
    const { getByTestId } = renderWithProviders(
      <AcademyProfile
        academy={{ ...sampleAcademyDetail, images: [] }}
        pro
        onRefresh={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("open-image-modal"));
    fireEvent.press(getByTestId("open-logo-modal"));
  });
});
