import { DailySchedule } from "./DailySchedule";
import { renderWithProviders } from "@utils/test-utils";

describe("<DailySchedule />", () => {
  it("should render", () => {
    renderWithProviders(<DailySchedule />);
  });
});
