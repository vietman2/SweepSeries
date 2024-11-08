import { fireEvent } from "@testing-library/react-native";

import { AddSchedule } from "./AddSchedule";
import { renderWithProviders } from "@utils/test-utils";

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

describe("<AddSchedule />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(<AddSchedule />);

    fireEvent.press(getByTestId("change-datetime"));
    fireEvent.press(getByTestId("cancel"));
  });
});
