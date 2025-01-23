import { Platform } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { RepeatModal } from "./RepeatModal";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");

  RN.Platform.OS = "ios";

  return RN;
});

describe("<RepeatModal />", () => {
  it("handles modal (count)", async () => {
    const { getByTestId } = renderWithProviders(
      <RepeatModal
        initialData={{ useRepeat: true, repeatPeriod: 0, repeatBreak: "" }}
        toggleRepeatModal={jest.fn()}
        handleUpdateRepeat={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("period-1"));
      fireEvent.press(getByTestId("count-chip"));
      fireEvent.press(getByTestId("wheel-picker"));
      fireEvent.press(getByTestId("toggle"));
      fireEvent.press(getByTestId("toggle"));
      fireEvent.press(getByTestId("confirm-alarm"));
    });
  });

  it("handles modal (until)", async () => {
    const { getByTestId } = renderWithProviders(
      <RepeatModal
        initialData={{ useRepeat: true, repeatPeriod: 0, repeatBreak: "" }}
        toggleRepeatModal={jest.fn()}
        handleUpdateRepeat={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("until-chip"));
      fireEvent.press(getByTestId("change-datetime"));
      fireEvent.press(getByTestId("cancel"));
      fireEvent.press(getByTestId("confirm-alarm"));
      fireEvent.press(getByTestId("cancel-alarm"));
      fireEvent.press(getByTestId("count-chip"));
    });
  });

  it("handles modal (until in android)", async () => {
    Platform.OS = "android";

    const { getByTestId } = renderWithProviders(
      <RepeatModal
        initialData={{ useRepeat: true, repeatPeriod: 0, repeatBreak: "" }}
        toggleRepeatModal={jest.fn()}
        handleUpdateRepeat={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("until-chip"));
    });
  });
});
