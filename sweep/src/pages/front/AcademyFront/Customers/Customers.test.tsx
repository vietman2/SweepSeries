import { CustomerManagement } from "./Customers";
import { renderWithProviders } from "@utils/test-utils";

describe("<CustomerManagement />", () => {
  it("renders correctly", () => {
    renderWithProviders(<CustomerManagement />);
  });
});
