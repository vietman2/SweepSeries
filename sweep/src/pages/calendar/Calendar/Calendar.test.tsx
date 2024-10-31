import { Calendar } from "./Calendar";
import { renderWithProviders } from "@utils/test-utils";

describe("<Calendar />", () => {
  it("renders correctly (month >= 10)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-10-01").getTime());

    renderWithProviders(<Calendar />);
  });

  it("renders correctly (month < 10)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01").getTime());

    renderWithProviders(<Calendar />);
  });
});
