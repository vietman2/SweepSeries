import { ScheduleInput } from "./ScheduleInput";
import { renderWithProviders } from "@utils/test-utils";

describe("<ScheduleInput />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <ScheduleInput icon="icon" text="text" onPress={jest.fn()} />
    );
  });
});
