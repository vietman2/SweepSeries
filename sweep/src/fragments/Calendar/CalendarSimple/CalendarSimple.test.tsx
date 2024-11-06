import { CalendarSimple } from "./CalendarSimple";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(<CalendarSimple calendar={sampleCalendars[0]} />);
  });
});
