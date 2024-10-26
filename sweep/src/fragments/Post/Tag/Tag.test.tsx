import { Tag } from "./Tag";
import { sampleTags } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

describe("<Tag />", () => {
  it("renders all types correctly", () => {
    renderWithProviders(
      <>
        <Tag tag={sampleTags[0]} />
        <Tag tag={sampleTags[2]} />
        <Tag tag={sampleTags[0]} type={2} />
        <Tag tag={sampleTags[2]} type={2} selected />
      </>
    );
  });
});
