import { fireEvent, waitFor } from "@testing-library/react-native";
import * as IPicker from "expo-image-picker";

import { ImagesModal } from "./ImagesModal";
import * as AcademiesAPI from "@services/products/academy";
import { renderWithProviders } from "@utils/test-utils";

describe("<ImagesModal />", () => {
  const imageAssets = [
    {
      uri: "uri1",
      width: 100,
      height: 100,
    },
    {
      uri: "uri2",
      width: 100,
      height: 100,
    },
  ];

  beforeEach(() => {
    jest
      .spyOn(IPicker, "launchImageLibraryAsync")
      .mockResolvedValue({ canceled: false, assets: imageAssets });
  });

  it("renders and handles image upload and delete correctly", async () => {
    jest.spyOn(AcademiesAPI, "uploadImage").mockResolvedValueOnce([
      { id: 1, url: "url1" },
      { id: 2, url: "url2" },
    ]);
    jest.spyOn(AcademiesAPI, "deleteImage").mockResolvedValueOnce(true);

    const { getByTestId } = renderWithProviders(
      <ImagesModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        uuid="uuid"
        currentImages={[{ id: 3, uri: "url3" }]}
        refresh={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("delete-3"));
      fireEvent.press(getByTestId("upload"));
    });
  });

  it("handles api errors", async () => {
    jest.spyOn(AcademiesAPI, "uploadImage").mockResolvedValueOnce(null);
    jest.spyOn(AcademiesAPI, "deleteImage").mockResolvedValueOnce(null);

    const { getByTestId } = renderWithProviders(
      <ImagesModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        uuid="uuid"
        currentImages={[{ id: 3, uri: "url3" }]}
        refresh={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("delete-3"));
      fireEvent.press(getByTestId("upload"));
    });
  });

  it("handles picker cancel", async () => {
    jest
      .spyOn(IPicker, "launchImageLibraryAsync")
      .mockResolvedValue({ canceled: true, assets: null });

    const { getByTestId } = renderWithProviders(
      <ImagesModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        uuid="uuid"
        currentImages={[]}
        refresh={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("upload"));
    });
  });
});
