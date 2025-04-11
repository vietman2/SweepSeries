import { fireEvent } from "@testing-library/react-native";
import * as Router from "expo-router";

import { FrontLayout } from "./FrontLayout";
import * as FrontContexts from "@contexts/front";
import { renderWithProviders } from "@utils/test-utils";
import { sampleAcademyProfiles, sampleCoachProfiles } from "@testdata/products";

jest.mock("@fragments/Profile", () => ({
  SelectedProfile: () => <></>,
  PromodeProfile: () => <></>,
}));

describe("<FrontLayout />", () => {
  const defaultProfile = {
    uuid: sampleAcademyProfiles[0].uuid,
    name: sampleAcademyProfiles[0].name,
    image: sampleAcademyProfiles[0].logo,
  };
  const defaultContext = {
    academies: sampleAcademyProfiles,
    coaches: sampleCoachProfiles,
    isReady: true,
    refreshProfile: jest.fn(),
    selectAcademy: jest.fn(),
    selectCoach: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(Router, "usePathname").mockReturnValue("/front/academy");
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultContext,
      activeProfile: { ...defaultProfile, mode: "academy" },
    });
  });

  it("renders tabs correctly and handles profile change", () => {
    const { getByTestId } = renderWithProviders(<FrontLayout />);

    fireEvent.press(getByTestId("opensheet"));
    fireEvent.press(getByTestId("academy-2"));
    fireEvent.press(getByTestId("coach-1"));
  });

  it("renders lesson details page", () => {
    jest.spyOn(Router, "usePathname").mockReturnValue("/front/lesson/1");
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultContext,
      activeProfile: { ...defaultProfile, mode: "academy" },
    });

    const { getByTestId } = renderWithProviders(<FrontLayout />);

    fireEvent.press(getByTestId("back-button"));
  });

  it("renders error page", () => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultContext,
      academies: [],
      coaches: [],
      activeProfile: {
        uuid: sampleAcademyProfiles[0].uuid,
        name: sampleAcademyProfiles[0].name,
        image: sampleAcademyProfiles[0].logo,
        mode: "academy",
      },
    });

    renderWithProviders(<FrontLayout />);
  });

  it("renders loading", () => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultContext,
      activeProfile: {
        ...defaultProfile,
        mode: "academy",
      },
      isReady: false,
    });

    renderWithProviders(<FrontLayout />);
  });
});
