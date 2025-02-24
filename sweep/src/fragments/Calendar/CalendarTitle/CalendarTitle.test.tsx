import { CalendarTitle } from "./CalendarTitle";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarTitle />", () => {
  it("renders calendar title", () => {
    renderWithProviders(<CalendarTitle calendar={sampleCalendars[0]} />);
  });

  it("renders calendar with no logo", () => {
    renderWithProviders(<CalendarTitle calendar={{...sampleCalendars[0], logo: ""}} />);
  });
});
