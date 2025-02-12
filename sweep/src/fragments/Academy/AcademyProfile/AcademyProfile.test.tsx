import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyProfile } from "./AcademyProfile";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./ImagesModal", () => ({
  ImagesModal: () => "ImagesModal",
}));
jest.mock("./LogoModal", () => ({
  LogoModal: () => "LogoModal",
}));

describe("<AcademyProfile />", () => {
  it("renders normal mode correctly", async () => {
    const { getByTestId } = renderWithProviders(
      <AcademyProfile academy={sampleAcademyDetail} />
    );

    jest.spyOn(AcademiesAPI, "likeAcademy").mockResolvedValueOnce(null);
    await waitFor(() => fireEvent.press(getByTestId("like-button")));

    jest.spyOn(AcademiesAPI, "likeAcademy").mockResolvedValueOnce(true);
    await waitFor(() => fireEvent.press(getByTestId("like-button")));
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
