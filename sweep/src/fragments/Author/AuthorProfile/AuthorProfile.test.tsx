import { AuthorProfile } from "./AuthorProfile";
import { sampleAuthor, sampleAuthorNoImage } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";

describe("<AuthorProfile />", () => {
  it("should render without crashing", () => {
    renderWithProviders(
      <>
        <AuthorProfile author={sampleAuthor} imageOnly />
        <AuthorProfile author={sampleAuthorNoImage} />
      </>
    );
  });

  it("should return null if author is not given", () => {
    renderWithProviders(<AuthorProfile author={null} />);
  });
});
