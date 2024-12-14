import { fireEvent, waitFor } from "@testing-library/react-native";

import { Front } from "./FrontMain";
import * as AcademiesAPI from "@services/products/academy";
import * as CoachesAPI from "@services/products/coach";
import { sampleAcademies, sampleCoaches } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("../AcademyFront/AcademyFront", () => ({
  AcademyFront: () => <div data-testid="AcademyFront" />,
}));
jest.mock("../CoachFront/CoachFront", () => ({
  CoachFront: () => <div data-testid="CoachFront" />,
}));

describe("<FrontMain />", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => null);
    jest
      .spyOn(AcademiesAPI, "getMyAcademies")
      .mockResolvedValue(sampleAcademies);
    jest
      .spyOn(CoachesAPI, "getMyCoachProfile")
      .mockResolvedValue(sampleCoaches[1]);
  });

  it("handles bad responses", async () => {
    jest.spyOn(AcademiesAPI, "getMyAcademies").mockResolvedValue(null);
    jest
      .spyOn(CoachesAPI, "getMyCoachProfile")
      .mockResolvedValue(null);
    renderWithProviders(<Front />);
  });

  it("renders correctly and handles profile change", async () => {
    const { getByTestId } = renderWithProviders(<Front />);

    await waitFor(() => {
      fireEvent.press(getByTestId("opensheet"));
      fireEvent.press(getByTestId("close"));
      fireEvent.press(getByTestId("opensheet"));
      fireEvent.press(getByTestId("academy-1"));
      fireEvent.press(getByTestId("opensheet"));
      fireEvent.press(getByTestId("coach"));
    });
  });
});
