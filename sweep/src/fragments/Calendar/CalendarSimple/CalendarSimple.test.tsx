import { CalendarSimple } from "./CalendarSimple";
import { sampleCalendars } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarSimple />", () => {
  it("renders correctly", () => {
    renderWithProviders(<CalendarSimple calendar={sampleCalendars[0]} />);
  });

  it("renders new calendar correctly (no logo and no member)", () => {
    renderWithProviders(<CalendarSimple calendar={{...sampleCalendars[0], logo: "", num_members: 0}} />);
  });
});
