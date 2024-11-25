import { AuthorProfile } from "./AuthorProfile";
import { sampleAuthor, sampleAuthorNoImage } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

describe("<AuthorProfile />", () => {
  it("should render without crashing", () => {
    renderWithProviders(
      <>
        <AuthorProfile author={sampleAuthor} />
        <AuthorProfile author={sampleAuthorNoImage} />
      </>
    );
  });
});
