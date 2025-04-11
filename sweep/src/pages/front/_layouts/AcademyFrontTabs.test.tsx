import { fireEvent } from "@testing-library/react-native";
import * as Router from "expo-router";

import { AcademyFrontTabs } from "./AcademyFrontTabs";
import * as FrontContexts from "@contexts/front";
import { renderWithProviders } from "@utils/test-utils";

describe("<AcademyFrontTabs />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      academies: [],
      coaches: [],
      activeProfile: {
        uuid: "123",
        name: "Test Academy",
        image: "test-image-url",
        mode: "academy",
      },
      isReady: true,
      selectAcademy: jest.fn(),
      selectCoach: jest.fn(),
      refreshProfile: jest.fn(),
    });
  });

  it("should handle another tab press", () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/front/academy/123/profile");
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    const { getByTestId } = renderWithProviders(<AcademyFrontTabs />);

    const programTab = getByTestId("tab-programs");
    const customersTab = getByTestId("tab-customers");
    const reviewsTab = getByTestId("tab-reviews");
    const employeesTab = getByTestId("tab-employees");

    fireEvent(programTab, "press", mockEvent);
    fireEvent(customersTab, "press", mockEvent);
    fireEvent(reviewsTab, "press", mockEvent);
    fireEvent(employeesTab, "press", mockEvent);
  });

  it("should handle current tab press (no effect)", () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/front/academy/123/profile");
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    const { getByTestId } = renderWithProviders(<AcademyFrontTabs />);

    const profileTab = getByTestId("tab-profile");

    fireEvent(profileTab, "press", mockEvent);
  });

  it("should handle current tab press (go back)", () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/front/academy/123/notices/1");
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    const { getByTestId } = renderWithProviders(<AcademyFrontTabs />);

    const noticesTab = getByTestId("tab-notices");

    fireEvent(noticesTab, "press", mockEvent);
  });
});
