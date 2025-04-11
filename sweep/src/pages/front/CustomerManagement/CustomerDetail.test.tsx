import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyCustomerDetail, CoachCustomerDetail } from "./CustomerDetail";
import * as FrontContexts from "@contexts/front";
import * as StudentsAPI from "@services/products/students";
import { sampleCoachDetail, sampleStudentLesson } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Lesson", () => ({
  LessonSimple: () => null,
}));

const defaultProfile = {
  uuid: "1",
  name: "Test Academy",
  image: "test_image.png",
};
const defaultFrontContext = {
  academies: [],
  coaches: [],
  isReady: true,
  selectAcademy: jest.fn(),
  selectCoach: jest.fn(),
  refreshProfile: jest.fn(),
};

describe("<AcademyCustomerDetail />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-10-01").getTime());
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: { ...defaultProfile, mode: "academy" },
    });
    jest
      .spyOn(StudentsAPI, "getAcademyStudentDetail")
      .mockResolvedValue(sampleStudentLesson);
  });

  it("handles academy mode correctly and back", async () => {
    const { getByTestId } = renderWithProviders(<AcademyCustomerDetail />);

    await waitFor(() => {
      fireEvent.press(getByTestId("lesson-1"));
      fireEvent.press(getByTestId("back-button"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(StudentsAPI, "getAcademyStudentDetail").mockResolvedValue(null);

    waitFor(() => renderWithProviders(<AcademyCustomerDetail />));
  });

  it("handles bad config", async () => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: { ...defaultProfile, mode: "coach" },
    });

    renderWithProviders(<AcademyCustomerDetail />);
  });
});

describe("<CoachCustomerDetail />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01").getTime());
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: { ...defaultProfile, mode: "coach", uuid: "2" },
    });
    jest.spyOn(FrontContexts, "useCoachFront").mockReturnValue({
      coach: sampleCoachDetail,
      reviews: undefined,
      lessons: [],
      loading: false,
      refresh: jest.fn(),
    });
    jest
      .spyOn(StudentsAPI, "getAcademyStudentDetail")
      .mockResolvedValue(sampleStudentLesson);
  });

  it("handles coach mode correctly and refresh", async () => {
    const { getByTestId } = renderWithProviders(<CoachCustomerDetail />);

    await waitFor(() => {
      fireEvent.press(getByTestId("lesson-1"));
      fireEvent.press(getByTestId("refresh"));
    });
  });

  it("handles bad config (academy mode)", async () => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: { ...defaultProfile, mode: "academy" },
    });

    renderWithProviders(<CoachCustomerDetail />);
  });

  it("handles bad config (no coach)", async () => {
    jest.spyOn(FrontContexts, "useCoachFront").mockReturnValue({
      coach: undefined,
      reviews: undefined,
      lessons: [],
      loading: false,
      refresh: jest.fn(),
    });

    renderWithProviders(<CoachCustomerDetail />);
  });
});
