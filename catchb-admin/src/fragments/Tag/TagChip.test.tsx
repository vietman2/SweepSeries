import { TagChip } from "./TagChip";
import { sampleTags } from "@data/community";
import { renderWithProviders } from "@utils/test-utils";

describe("<TagChip />", () => {
  it("should render", () => {
    renderWithProviders(<TagChip tag={sampleTags[0]} />);
  });
});
