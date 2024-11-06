import { CalendarOptions } from "./CalendarOptions";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarOptions />", () => {
  it("renders correctly", () => {
    renderWithProviders(<CalendarOptions calendar={sampleCalendars[0]} />);
  });
});
