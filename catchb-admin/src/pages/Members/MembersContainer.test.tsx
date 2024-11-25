import { MembersContainer } from "./MembersContainer";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./People", () => ({
  PeopleList: () => <div>People List</div>,
}));
jest.mock("./Users", () => ({
  UsersLayout: () => <div>Users Layout</div>,
  UserDetail: () => <div>User Detail</div>,
}));

describe("<MembersContainer />", () => {
  it("should render without crashing", () => {
    renderWithProviders(<MembersContainer />);
  });
});
