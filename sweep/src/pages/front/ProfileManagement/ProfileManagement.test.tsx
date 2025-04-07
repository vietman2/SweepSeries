import { ProfileManagement } from "./ProfileManagement";
import * as FrontContext from "@contexts/front";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./AcademyProfile/AcademyProfile", () => {
  const { View } = jest.requireActual("react-native");

  return {
    AcademyProfileManagement: () => <View testID="academy-profile" />,
  };
});
jest.mock("./CoachProfile/CoachProfile", () => {
  const { View } = jest.requireActual("react-native");

  return {
    CoachProfileManagement: () => <View testID="coach-profile" />,
  };
});

describe("<ProfileManagement />", () => {
  const defaultContext = {
    uuid: "1",
    coach: undefined,
    academies: [],
    headerImage: "",
    headerText: "",
    selectCoach: jest.fn(),
    selectAcademy: jest.fn(),
    refresh: jest.fn(),
  };

  it("should render academy profile", () => {
    jest
      .spyOn(FrontContext, "useFront")
      .mockReturnValue({ ...defaultContext, mode: "academy" });

    const { getByTestId } = renderWithProviders(<ProfileManagement />);

    expect(getByTestId("academy-profile")).toBeTruthy();
  });

  it("should render coach profile", () => {
    jest
      .spyOn(FrontContext, "useFront")
      .mockReturnValue({ ...defaultContext, mode: "coach" });

    const { getByTestId } = renderWithProviders(<ProfileManagement />);

    expect(getByTestId("coach-profile")).toBeTruthy();
  });

  it("should render nothing", () => {
    jest
      .spyOn(FrontContext, "useFront")
      .mockReturnValue({ ...defaultContext, mode: null });

    renderWithProviders(<ProfileManagement />);
  });
});
