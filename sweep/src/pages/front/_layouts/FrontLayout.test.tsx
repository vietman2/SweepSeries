import { fireEvent } from "@testing-library/react-native";

import { FrontLayout } from "./FrontLayout";
import * as FrontContext from "@contexts/front";
import { sampleAcademies, sampleCoaches } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<FrontLayout />", () => {
  const defaultContext = {
    uuid: "1",
    academies: sampleAcademies,
    coach: sampleCoaches[0],
    headerImage: "",
    headerText: "",
    selectAcademy: jest.fn(),
    selectCoach: jest.fn(),
    refresh: jest.fn(),
  };

  it("renders correctly and handles back press", () => {
    jest
      .spyOn(FrontContext, "useFront")
      .mockReturnValue({ ...defaultContext, mode: "academy", uuid: "2" });
    const { getAllByTestId } = renderWithProviders(<FrontLayout />);

    fireEvent.press(getAllByTestId("back-button")[0]);
  });

  it("renders correctly and handles bottom sheet", () => {
    jest
      .spyOn(FrontContext, "useFront")
      .mockReturnValue({ ...defaultContext, mode: "coach" });
    const { getByTestId } = renderWithProviders(<FrontLayout />);

    fireEvent.press(getByTestId("opensheet"));
    fireEvent.press(getByTestId("academy-1"));
    fireEvent.press(getByTestId("coach"));
  });
});
