import { Front } from "./FrontMain";
import * as FrontContext from "@contexts/front";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("../AcademyFront/AcademyFront", () => ({
  AcademyFront: () => <div data-testid="AcademyFront" />,
}));
jest.mock("../CoachFront/CoachFront", () => ({
  CoachFront: () => <div data-testid="CoachFront" />,
}));

describe("<FrontMain />", () => {
  const commonParams = {
    uuid: "1",
    academies: [],
    coach: undefined,
    headerImage: "",
    headerText: "",
    selectAcademy: jest.fn(),
    selectCoach: jest.fn(),
  };

  it("renders null correctly", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      ...commonParams,
      mode: null,
    });

    renderWithProviders(<Front />);
  });

  it("renders academy correctly", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      ...commonParams,
      mode: "academy",
    });

    renderWithProviders(<Front />);
  });

  it("renders coach correctly", async () => {
    jest.spyOn(FrontContext, "useFront").mockReturnValue({
      ...commonParams,
      mode: "coach",
    });

    renderWithProviders(<Front />);
  });
});
