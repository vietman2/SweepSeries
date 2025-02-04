import { fireEvent } from "@testing-library/react-native";
import * as IPicker from "expo-image-picker";

import { LogoModal } from "./LogoModal";
import * as AcademiesAPI from "@services/products/academy";
import { renderWithProviders } from "@utils/test-utils";

describe("<LogoModal />", () => {
  it("renders and updates logo correctly", async () => {
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockResolvedValue({
      canceled: false,
      assets: [{ uri: "uri", width: 100, height: 100 }],
    });
    jest.spyOn(AcademiesAPI, "updateLogo").mockResolvedValue(true);

    const { getByTestId } = renderWithProviders(
      <LogoModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        uuid="uuid"
        currentLogo="currentLogo"
      />
    );

    fireEvent.press(getByTestId("close"));
    fireEvent.press(getByTestId("change"));
  });

  it("handles logo update error", async () => {
    jest.spyOn(AcademiesAPI, "updateLogo").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(
      <LogoModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        uuid="uuid"
        currentLogo="currentLogo"
      />
    );

    fireEvent.press(getByTestId("change"));
  });

  it("handles image pick cancel", async () => {
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockResolvedValue({
      canceled: true,
      assets: null,
    });

    const { getByTestId } = renderWithProviders(
      <LogoModal
        modalOpen={true}
        setModalOpen={jest.fn()}
        uuid="uuid"
        currentLogo="currentLogo"
      />
    );

    fireEvent.press(getByTestId("change"));
  });
});
