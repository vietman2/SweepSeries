import * as Router from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { UserList } from "./UserList";
import { sampleUsers } from "@data/members";
import * as MembersAPI from "@services/auth/members";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/User", () => ({
  UserSimpleHeader: () => <div>UserSimpleHeader</div>,
  UserSimple: () => <div>UserSimple</div>,
}));

describe("<UserList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/members/users",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest.spyOn(MembersAPI, "getUsers").mockResolvedValue(sampleUsers);
  });

  it("should handle error", async () => {
    jest.spyOn(MembersAPI, "getUsers").mockResolvedValue(null);
    renderWithProviders(<UserList />);

    await waitFor(() =>
      expect(screen.getByText("새로고침")).toBeInTheDocument()
    );

    waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("should render and handle navigation", async () => {
    renderWithProviders(<UserList />);

    await waitFor(() =>
      expect(screen.getByText("사용자 목록")).toBeInTheDocument()
    );

    waitFor(() => fireEvent.click(screen.getByTestId("user-1")));
  });

  it("should render in the background", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/members/users/1",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    renderWithProviders(<UserList />);
  });
});
