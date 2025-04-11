import { fireEvent } from "@testing-library/react-native";
import * as Router from "expo-router";

import { CoachFrontTabs } from "./CoachFrontTabs";
import * as FrontContexts from "@contexts/front";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachFrontTabs />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      academies: [],
      coaches: [],
      activeProfile: {
        uuid: "123",
        name: "Test Coach",
        image: "test-image-url",
        mode: "coach",
      },
      isReady: true,
      selectAcademy: jest.fn(),
      selectCoach: jest.fn(),
      refreshProfile: jest.fn(),
    });
  });

  it("should handle current tab press (no effect)", () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/front/coach/123/profile");
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    const { getByTestId } = renderWithProviders(<CoachFrontTabs />);

    const profileTab = getByTestId("tab-profile");

    fireEvent(profileTab, "press", mockEvent);
  });

  it("should handle current tab press (go back)", () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/front/coach/123/reviews/1");
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    const { getByTestId } = renderWithProviders(<CoachFrontTabs />);

    const reviewsTab = getByTestId("tab-reviews");

    fireEvent(reviewsTab, "press", mockEvent);
  });

  it("should handle another tab press", () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/front/coach/123/profile");
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    const { getByTestId } = renderWithProviders(<CoachFrontTabs />);

    const customersTab = getByTestId("tab-customers");

    fireEvent(customersTab, "press", mockEvent);
  });
});
