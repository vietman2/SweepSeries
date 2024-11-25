import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { UserDetail } from "./UserDetail";
import * as MembersAPI from "@services/auth/members";
import { renderWithProviders } from "@utils/test-utils";
import { sampleUsers } from "@data/members";

jest.mock("@fragments/User", () => ({
  UserProfile: () => <div>User Profile</div>,
}));

describe("<UserDetail />", () => {
  beforeEach(() => {
    jest.spyOn(Router, "useParams").mockReturnValue({ tagId: "1" });
  });

  it("should handle API error", async () => {
    jest.spyOn(MembersAPI, "getUserDetails").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<UserDetail />));

    await waitFor(() =>
      expect(screen.getByText("새로고침")).toBeInTheDocument()
    );
    waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("should render user details", async () => {
    jest.spyOn(MembersAPI, "getUserDetails").mockResolvedValue(sampleUsers[0]);
    waitFor(() => renderWithProviders(<UserDetail />));

    await waitFor(() =>
      expect(screen.getByText("사용자 정보")).toBeInTheDocument()
    );
  });
});
