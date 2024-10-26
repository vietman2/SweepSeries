import { PostSimple } from "./PostSimple";
import { samplePosts } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("../Tag/Tag", () => ({
  Tag: () => null,
}));

describe("<PostSimple />", () => {
  it("renders correctly (with and without image)", () => {
    renderWithProviders(
      <>
        <PostSimple post={samplePosts[0]} />
        <PostSimple post={samplePosts[1]} />
      </>
    );
  });
});
