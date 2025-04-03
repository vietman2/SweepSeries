import { TimeSelector } from "./TimeSelector";
import { sampleAvailableTimes } from "@testdata/products";
import { fireEvent } from "@testing-library/react-native";
import { renderWithProviders } from "@utils/test-utils";

describe("<TimeSelector />", () => {
  it("renders correctly when options are null", () => {
    const { getByText } = renderWithProviders(
      <TimeSelector
        options={null}
        selectedTime=""
        setSelectedTime={jest.fn()}
      />
    );

    expect(getByText("아카데미 휴무일입니다.")).toBeTruthy();
  });

  it("renders correctly when options are available", () => {
    const { getByTestId } = renderWithProviders(
      <TimeSelector
        options={sampleAvailableTimes}
        selectedTime="09:00"
        setSelectedTime={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("time-09:30"));
  });
});
