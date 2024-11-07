import { fireEvent } from "@testing-library/react-native";

import { CalendarButtons } from "./CalendarButtons";
import { renderWithProviders } from "@utils/test-utils";

describe("<CalendarButtons />", () => {
  it("renders open correctly", () => {
    renderWithProviders(<CalendarButtons open setOpen={jest.fn()} />);
  });

  it("renders closed correctly", () => {
    const { getByTestId } = renderWithProviders(
      <CalendarButtons open={false} setOpen={jest.fn()} />
    );

    fireEvent.press(getByTestId("open"));
  });
});
