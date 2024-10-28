import { Filters } from "./Filters";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Filters");

describe("<Filters />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <Filters
        filters={["All", "Active", "Completed"]}
        selectedFilter="All"
        onSelect={jest.fn()}
      />
    );
  });
});
