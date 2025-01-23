import { fireEvent, waitFor } from "@testing-library/react-native";

import { AlarmModal } from "./AlarmModal";
import { renderWithProviders } from "@utils/test-utils";

describe("<AlarmModal />", () => {
  it("handles modal", async () => {
    const { getByTestId, getAllByTestId } = renderWithProviders(
      <AlarmModal
        initialData={{ useAlarm: true, delta: 1, unit: 1 }}
        setAlarmModalOpen={jest.fn()}
        handleUpdateAlarm={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getAllByTestId("wheel-picker")[0]);
      fireEvent.press(getAllByTestId("wheel-picker")[1]);
      fireEvent.press(getByTestId("toggle"));
      fireEvent.press(getByTestId("toggle"));
      fireEvent.press(getByTestId("cancel-alarm"));
      fireEvent.press(getByTestId("confirm-alarm"));
      fireEvent.press(getByTestId("close-alarm-modal"));
    });
  });
});
