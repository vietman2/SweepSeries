import { TouchableOpacity } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { FrontProvider, useFront } from "./FrontContext";
import * as ProfilesAPI from "@services/products/profiles";
import * as StorageAPI from "@services/storage/asyncstorage";
import { sampleAcademyProfiles, sampleCoachProfiles } from "@testdata/products";

const TestComponent = () => {
  const { selectAcademy, selectCoach, refreshProfile } = useFront();

  return (
    <>
      <TouchableOpacity
        onPress={() => selectAcademy(sampleAcademyProfiles[0])}
        testID="academy"
      />
      <TouchableOpacity
        onPress={() => selectCoach(sampleCoachProfiles[0])}
        testID="coach"
      />
      <TouchableOpacity onPress={refreshProfile} testID="refresh" />
    </>
  );
};

describe("<FrontContext />", () => {
  const renderPage = () => {
    return render(
      <FrontProvider>
        <TestComponent />
      </FrontProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValue(null);
    jest.spyOn(ProfilesAPI, "getPromodeProfiles").mockResolvedValue({
      academies: [{ ...sampleAcademyProfiles[0], uuid: "academy1" }],
      coach: [{ ...sampleCoachProfiles[0], uuid: "coach1" }],
    });
  });

  it("handles no storage data and defaults to first academy", async () => {
    jest.spyOn(ProfilesAPI, "getPromodeProfiles").mockResolvedValue({
      academies: [{ ...sampleAcademyProfiles[0], uuid: "academy1" }],
      coach: [],
    });

    const { getByTestId } = renderPage();

    await waitFor(() => {
      fireEvent.press(getByTestId("academy"));
    });
  });

  it("handles no storage data and defaults to first coach", async () => {
    jest.spyOn(ProfilesAPI, "getPromodeProfiles").mockResolvedValue({
      academies: [],
      coach: [{ ...sampleCoachProfiles[0], uuid: "coach1" }],
    });

    const { getByTestId } = renderPage();

    await waitFor(() => {
      fireEvent.press(getByTestId("coach"));
    });
  });

  it("handles academy data saved in storage, api error and refresh", async () => {
    jest.spyOn(ProfilesAPI, "getPromodeProfiles").mockResolvedValueOnce(null);
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValue("academy1");

    const { getByTestId } = renderPage();

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
    });
  });

  it("handles coach data saved in storage", async () => {
    jest.spyOn(StorageAPI, "getStorage").mockResolvedValue("coach1");

    await waitFor(() => renderPage());
  });

  it("handles context misuse", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow();
  });
});
