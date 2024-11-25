import { fireEvent, screen, waitFor } from "@testing-library/react";

import { PeopleList } from "./PeopleList";
import { samplePeople } from "@data/members";
import * as MembersAPI from "@services/auth/members";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Person", () => ({
  PersonSimple: () => <div>Person Simple</div>,
  PersonSimpleHeader: () => <div>Person Simple Header</div>,
}));

describe("<PeopleList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(MembersAPI, "getPeople").mockResolvedValue(samplePeople);
  });

  it("should handle error", async () => {
    jest.spyOn(MembersAPI, "getPeople").mockResolvedValue(null);
    renderWithProviders(<PeopleList />);

    await waitFor(() =>
      expect(screen.getByText("새로고침")).toBeInTheDocument()
    );

    waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("should render in foreground", async () => {
    renderWithProviders(<PeopleList />);

    await waitFor(() =>
      expect(screen.getByText("미가입 회원 목록")).toBeInTheDocument()
    );
  });
});
