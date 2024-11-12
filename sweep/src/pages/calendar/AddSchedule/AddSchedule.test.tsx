import { Platform } from "react-native";
import { fireEvent } from "@testing-library/react-native";

import { AddSchedule } from "./AddSchedule";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");

  RN.Platform.OS = "ios";

  return RN;
});
jest.mock("@react-native-community/datetimepicker", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    __esModule: true,
    default: ({
      onChange,
    }: {
      onChange: (event: any, selectedDate?: Date) => void;
    }) => {
      return (
        <>
          <TouchableOpacity
            onPress={() => onChange({}, new Date())}
            testID="change-datetime"
          />
          <TouchableOpacity onPress={() => onChange({})} testID="cancel" />
        </>
      );
    },
    DateTimePickerEvent: jest.fn(),
  };
});
jest.mock("@fragments/Schedule", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");

  return {
    DateTimeHeader: ({
      handleEndMode,
      handleStartMode,
    }: {
      handleEndMode: () => void;
      handleStartMode: () => void;
    }) => (
      <>
        <TouchableOpacity onPress={handleStartMode} testID="start" />
        <TouchableOpacity onPress={handleEndMode} testID="end" />
      </>
    ),
    ScheduleInput: () => null,
  };
});

describe("<AddSchedule />", () => {
  it("renders correctly (ios)", () => {
    Platform.OS = "ios";

    const { getByTestId } = renderWithProviders(<AddSchedule />);

    fireEvent.press(getByTestId("start"));
    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("cancel"));
    fireEvent.press(getByTestId("end"));
    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("all-day"));
  });

  it("renders correctly (android)", () => {
    Platform.OS = "android";

    const { getByTestId } = renderWithProviders(<AddSchedule />);

    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("cancel"));
  });
});
