import { Text, TouchableOpacity, View } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { CalendarProvider, useCalendar } from "./CalendarContext";
import * as CalendarsAPI from "@services/calendar/calendars";
import * as StorageAPI from "@services/storage/asyncstorage";
import { sampleCalendars } from "@testdata/calendar";

jest.unmock("@contexts/calendar");

const TestComponent = () => {
  const { setSelectedCalendar, reloadData } = useCalendar();

  return (
    <View>
      {sampleCalendars.map((calendar) => (
        <Text key={calendar.id}>{calendar.name}</Text>
      ))}
      <TouchableOpacity
        onPress={() => {
          setSelectedCalendar(sampleCalendars[1]);
        }}
        testID="setSelectedCalendar"
      />
      <TouchableOpacity onPress={reloadData} testID="reloadData" />
    </View>
  );
};

describe("CalendarProvider", () => {
  it("renders and updates selected calendar correctly", async () => {
    jest.spyOn(CalendarsAPI, "getCalendars").mockResolvedValue(sampleCalendars);
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValue("2");

    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("setSelectedCalendar"));
      fireEvent.press(getByTestId("reloadData"));
    });
  });

  it("handles saved calendar dne", async () => {
    jest.spyOn(CalendarsAPI, "getCalendars").mockResolvedValue(sampleCalendars);
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValue("100");

    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("setSelectedCalendar"));
    });
  });

  it("handles no saved calendar", async () => {
    jest.spyOn(CalendarsAPI, "getCalendars").mockResolvedValue(sampleCalendars);
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValue(null);

    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("setSelectedCalendar"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(CalendarsAPI, "getCalendars").mockResolvedValue(null);

    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("setSelectedCalendar"));
    });
  });

  it("handles context misuse", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow();
  });
});
