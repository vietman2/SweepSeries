import { fireEvent } from "@testing-library/react-native";

import { ColorModal } from "./ColorModal";
import { renderWithProviders } from "@utils/test-utils";

describe("<ColorModal />", () => {
  it("renders", () => {
    const { getByTestId } = renderWithProviders(
      <ColorModal
        colorModalOpen
        setColorModalOpen={jest.fn()}
        selectedColor="#FF6B6B"
        handleUpdateColor={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("select-color-#FF6B6B"));
    fireEvent.press(getByTestId("close-color-modal"));
  });
});
