import { ScheduleSimple } from "./ScheduleSimple";
import { sampleSchedules } from "@testdata/calendar";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

describe("<ScheduleSimple />", () => {
  it("should render without crashing", () => {
    renderWithProviders(<ScheduleSimple schedule={sampleSchedules[0]} />);
  });
});
