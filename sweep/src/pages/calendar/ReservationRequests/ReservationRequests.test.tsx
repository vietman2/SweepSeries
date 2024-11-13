import { ReservationRequests } from "./ReservationRequests";
import { renderWithProviders } from "@utils/test-utils";

describe("<ReservationRequests />", () => {
  it("renders correctly", () => {
    renderWithProviders(<ReservationRequests />);
  });
});
