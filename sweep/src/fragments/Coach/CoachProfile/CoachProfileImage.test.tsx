import { fireEvent, waitFor } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";

import { CoachProfileImage, CoachProfileImageEdit } from "./CoachProfileImage";
import * as CoachesAPI from "@services/products/coach";
import { sampleCoachDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachProfileImage />", () => {
  it("renders correctly", () => {
    renderWithProviders(<CoachProfileImage coach={sampleCoachDetail} />);
  });
});

describe("<CoachProfileImageEdit />", () => {
  const mockImageAsset = {
    uri: "sample-uri",
    width: 100,
    height: 100,
    fileName: "sample.jpg",
  };

  beforeEach(() => {
    jest.spyOn(ImagePicker, "launchImageLibraryAsync").mockResolvedValue({
      canceled: false,
      assets: [mockImageAsset],
    });
  });

  it("renders correctly and handles image upload", async () => {
    jest.spyOn(CoachesAPI, "updateCoachProfileImage").mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(
      <CoachProfileImageEdit coach={sampleCoachDetail} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("open-modal"));
      fireEvent.press(getByTestId("change-profile"));
    });
  });

  it("handles image upload cancel and fail", async () => {
    jest.spyOn(ImagePicker, "launchImageLibraryAsync").mockResolvedValueOnce({
      canceled: true,
      assets: null,
    });
    jest.spyOn(CoachesAPI, "updateCoachProfileImage").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(
      <CoachProfileImageEdit coach={sampleCoachDetail} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("open-modal"));
      fireEvent.press(getByTestId("change-profile")); // image pick cancel
      fireEvent.press(getByTestId("change-profile")); // api fail
    });
  });
});
