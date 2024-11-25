import { sampleUsers } from "@data/members";
import { UserSimpleHeader, UserSimple } from "./UserSimple";
import { renderWithProviders } from "@utils/test-utils";

describe("<UserSimpleHeader />", () => {
  it("renders user header", () => {
    renderWithProviders(<UserSimpleHeader />);
  });
});

describe("<UserSimple />", () => {
  it("renders user info", () => {
    renderWithProviders(<UserSimple user={sampleUsers[0]} />);
  });
});
