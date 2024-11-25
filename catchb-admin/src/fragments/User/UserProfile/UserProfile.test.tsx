import { UserProfile } from "./UserProfile";
import { sampleUsers } from "@data/members";
import { renderWithProviders } from "@utils/test-utils";

describe("<UserProfile />", () => {
  it("should render correctly", () => {
    renderWithProviders(
      <>
        <UserProfile profile={sampleUsers[0].profiles[0]} />
        <UserProfile profile={sampleUsers[0].profiles[1]} />
      </>
    );
  });
});
