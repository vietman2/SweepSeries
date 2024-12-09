import { fireEvent, waitFor } from "@testing-library/react-native";
import * as IPicker from "expo-image-picker";

import { ImagePicker } from "./ImagePicker";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Pickers");

describe("<ImagePicker />", () => {
  const assets = [
    {
      assetId: "testId",
      uri: "testUri",
      width: 100,
      height: 100,
    },
  ];

  it("should handle correctly (uploaded)", async () => {
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockImplementation(() =>
      Promise.resolve({
        canceled: false,
        assets: assets,
      })
    );
    const { getByTestId } = renderWithProviders(
      <ImagePicker
        uploadedImages={[]}
        setUploadedImages={jest.fn()}
        maxImages={10}
        description="Description"
        imageOnly={false}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("imagePicker"));
    });
  });

  it("should handle upload fail correctly (duplicate) and remove", async () => {
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockImplementation(() =>
      Promise.resolve({
        canceled: false,
        assets: assets,
      })
    );
    const { getByTestId } = renderWithProviders(
      <ImagePicker
        uploadedImages={assets}
        setUploadedImages={jest.fn()}
        maxImages={10}
        description="Description"
        imageOnly
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("imagePicker"));
      fireEvent.press(getByTestId("removeImage"));
    });
  });

  it("should handle image picker: cancelled", async () => {
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockImplementation(() =>
      Promise.resolve({
        canceled: true,
        assets: null,
      })
    );
    const { getByTestId } = renderWithProviders(
      <ImagePicker uploadedImages={[]} setUploadedImages={jest.fn()} />
    );

    waitFor(() => fireEvent.press(getByTestId("imagePicker")));
  });

  it("should handle image picker: max number reached", async () => {
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockImplementation(() =>
      Promise.resolve({
        canceled: true,
        assets: null,
      })
    );
    renderWithProviders(
      <ImagePicker
        uploadedImages={assets}
        setUploadedImages={jest.fn()}
        maxImages={1}
      />
    );
  });
});
