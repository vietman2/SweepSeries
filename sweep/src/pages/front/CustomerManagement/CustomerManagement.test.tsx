import { fireEvent, waitFor } from "@testing-library/react-native";

import {
  AcademyCustomerManagement,
  CoachCustomerManagement,
} from "./CustomerManagement";
import * as FrontContexts from "@contexts/front";
import * as StudentsAPI from "@services/products/students";
import { sampleLessonSimple } from "@testdata/calendar";
import { sampleCoachDetail, sampleStudents } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Profile", () => ({
  ProfileImage: () => <div />,
}));
jest.mock("@fragments/Schedule", () => ({
  ScheduleSimple: () => <div />,
}));

const defaultProfile = {
  uuid: "academy-uuid",
  name: "Academy Name",
  image: "",
};
const defaultFrontContext = {
  academies: [],
  coaches: [],
  isReady: true,
  selectAcademy: jest.fn(),
  selectCoach: jest.fn(),
  refreshProfile: jest.fn(),
};

describe("<AcademyCustomerManagement />", () => {
  beforeEach(() => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: { ...defaultProfile, mode: "academy" },
    });
    jest.spyOn(FrontContexts, "useAcademyFront").mockReturnValue({
      academy: null,
      programs: [],
      notices: [],
      coaches: [],
      requests: [],
      reviews: undefined,
      lessons: [sampleLessonSimple],
      facilityOptions: [],
      loading: false,
      refresh: jest.fn(),
    });
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(sampleStudents);
  });

  it("renders correctly", async () => {
    const { getByTestId } = renderWithProviders(<AcademyCustomerManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      fireEvent.press(getByTestId("student-1"));
    });
  });

  it("handles api error", async () => {
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(null);
    renderWithProviders(<AcademyCustomerManagement />);
  });

  it("handles bad config", async () => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: { ...defaultProfile, mode: "coach" },
    });
    renderWithProviders(<AcademyCustomerManagement />);
  });
});

describe("<CoachCustomerManagement />", () => {
  beforeEach(() => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: { ...defaultProfile, mode: "coach" },
    });
    jest.spyOn(FrontContexts, "useCoachFront").mockReturnValue({
      coach: sampleCoachDetail,
      reviews: undefined,
      lessons: [],
      loading: false,
      refresh: jest.fn(),
    });
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(sampleStudents);
  });

  it("renders correctly", async () => {
    const { getByTestId } = renderWithProviders(<CoachCustomerManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      fireEvent.press(getByTestId("student-1"));
    });
  });

  it("handles bad config (no coach)", async () => {
    jest.spyOn(FrontContexts, "useCoachFront").mockReturnValue({
      coach: undefined,
      reviews: undefined,
      lessons: [],
      loading: false,
      refresh: jest.fn(),
    });

    renderWithProviders(<CoachCustomerManagement />);
  });

  it("handles bad config (wrong mode)", async () => {
    jest.spyOn(FrontContexts, "useFront").mockReturnValue({
      ...defaultFrontContext,
      activeProfile: { ...defaultProfile, mode: "academy" },
    });

    renderWithProviders(<CoachCustomerManagement />);
  });
});
