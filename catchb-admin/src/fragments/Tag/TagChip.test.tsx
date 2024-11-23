import { TagChip, TagPreview } from "./TagChip";
import { sampleTags } from "@data/community";
import { renderWithProviders } from "@utils/test-utils";

describe("<TagChip />", () => {
  it("should render", () => {
    renderWithProviders(
      <>
        <TagChip tag={sampleTags[0]} />
        <TagChip tag={sampleTags[1]} small />
      </>
    );
  });
});

describe("<TagPreview />", () => {
  it("should render", () => {
    renderWithProviders(
      <>
        <TagPreview label="label" icon="icon" color="color" bgColor="bgColor" />
        <TagPreview
          label="label"
          icon=""
          color="color"
          bgColor="bgColor"
          small
        />
      </>
    );
  });
});
