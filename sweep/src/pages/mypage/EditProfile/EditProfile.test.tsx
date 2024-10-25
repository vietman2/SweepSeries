import { fireEvent } from "@testing-library/react-native";
import { EditProfile } from "./EditProfile";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Profile", () => ({
  ProfileImage: () => null,
}));

describe("<EditProfile />", () => {
  it("renders and handles birthdate format correctly", () => {
   const { getByTestId } = renderWithProviders(<EditProfile />);

   fireEvent.changeText(getByTestId("YYYY-MM-DD"), "1990-01-01");
  });
});
