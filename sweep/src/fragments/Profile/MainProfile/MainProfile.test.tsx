import { fireEvent } from "@testing-library/react-native";

import { MainProfile } from "./MainProfile";
import { sampleAuthor } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("../ProfileImage/ProfileImage", () => ({
  ProfileImage: "ProfileImage",
}));

describe("<MainProfile>", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(
      <MainProfile profile={sampleAuthor} />
    );

    fireEvent.press(getByTestId("edit-profile"));
  });
});
