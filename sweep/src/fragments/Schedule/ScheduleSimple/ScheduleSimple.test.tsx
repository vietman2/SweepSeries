import { ScheduleSimple } from "./ScheduleSimple";
import { sampleSchedules } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<ScheduleSimple />", () => {
  it("should render without crashing", () => {
    renderWithProviders(
      <>
        <ScheduleSimple schedule={sampleSchedules[0]} />
        <ScheduleSimple schedule={sampleSchedules[1]} />
      </>
    );
  });
});
