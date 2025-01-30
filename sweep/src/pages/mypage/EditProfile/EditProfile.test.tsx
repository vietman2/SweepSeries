import { fireEvent, waitFor } from "@testing-library/react-native";
import * as IPicker from "expo-image-picker";

import { EditProfile } from "./EditProfile";
import * as AuthAPI from "@services/auth/auth";
import * as ProfilesAPI from "@services/auth/profiles";
import { sampleUser } from "@testdata/auth";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));
jest.mock("@fragments/Profile", () => ({
  ProfileImage: () => null,
}));

describe("<EditProfile />", () => {
  const mockImage = [
    {
      assetId: "testId",
      uri: "testUri",
      width: 100,
      height: 100,
    },
  ];

  beforeEach(() => {
    jest.spyOn(AuthAPI, "me").mockResolvedValue(sampleUser);
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockImplementation(() =>
      Promise.resolve({
        canceled: false,
        assets: mockImage,
      })
    );
  });

  it("handles update profile correctly", async () => {
    jest.spyOn(AuthAPI, "me").mockResolvedValue({
      ...sampleUser,
      selected_profile: { nickname: null, introduction: null },
      person: { birth_date: null },
    });
    jest.spyOn(ProfilesAPI, "updateProfile").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(<EditProfile />);

    await waitFor(() => {
      fireEvent.changeText(getByTestId("nickname"), "testnickname");
      fireEvent.changeText(getByTestId("birth"), "19910101");
      fireEvent.changeText(getByTestId("introduction"), "testintroduction");
      fireEvent.press(getByTestId("변경하기"));
    });
  });

  it("handles update profile image correctly", async () => {
    jest.spyOn(ProfilesAPI, "uploadProfileImage").mockResolvedValue(true);
    const { getByTestId } = renderWithProviders(<EditProfile />);

    await waitFor(() => {
      fireEvent.press(getByTestId("profile-image"));
    });
  });

  it("handles update profile image cancel", async () => {
    jest.spyOn(IPicker, "launchImageLibraryAsync").mockImplementation(() =>
      Promise.resolve({
        canceled: true,
        assets: null,
      })
    );
    const { getByTestId } = renderWithProviders(<EditProfile />);

    await waitFor(() => {
      fireEvent.press(getByTestId("profile-image"));
    });
  });

  it("handles both fail", async () => {
    jest.spyOn(ProfilesAPI, "uploadProfileImage").mockResolvedValue(false);
    jest.spyOn(ProfilesAPI, "updateProfile").mockResolvedValue(false);
    const { getByTestId } = renderWithProviders(<EditProfile />);

    await waitFor(() => {
      fireEvent.press(getByTestId("profile-image"));
      fireEvent.press(getByTestId("변경하기"));
    });
  });

  it("handles profile load fail", async () => {
    jest.spyOn(AuthAPI, "me").mockResolvedValue(null);
    renderWithProviders(<EditProfile />);
  });
});
