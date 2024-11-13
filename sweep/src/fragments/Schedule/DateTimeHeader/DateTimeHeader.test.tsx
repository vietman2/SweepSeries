import { DateTimeHeader } from "./DateTimeHeader";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("react-native-svg", () => ({
  __esModule: true,
  default: "Svg",
  Line: "Line",
}));

describe("<DateTimeHeader />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <DateTimeHeader
          selectedStartDateTime={new Date()}
          selectedEndDateTime={new Date()}
          mode="start"
          handleStartMode={jest.fn()}
          handleEndMode={jest.fn()}
          isAllDay={false}
        />
        <DateTimeHeader
          selectedStartDateTime={new Date()}
          selectedEndDateTime={new Date()}
          mode="end"
          handleStartMode={jest.fn()}
          handleEndMode={jest.fn()}
          isAllDay={false}
        />
      </>
    );
  });
  
  it("renders all day mode correctly", () => {
    renderWithProviders(
      <>
        <DateTimeHeader
          selectedStartDateTime={new Date()}
          selectedEndDateTime={new Date()}
          mode="start"
          handleStartMode={jest.fn()}
          handleEndMode={jest.fn()}
          isAllDay={true}
        />
        <DateTimeHeader
          selectedStartDateTime={new Date()}
          selectedEndDateTime={new Date()}
          mode="end"
          handleStartMode={jest.fn()}
          handleEndMode={jest.fn()}
          isAllDay={true}
        />
      </>
    );
  });
});
