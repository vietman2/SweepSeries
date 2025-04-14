import { fireEvent } from "@testing-library/react-native";
import * as Router from "expo-router";

import { AcademyDetailLayout } from "./AcademyDetailLayout";
import * as AcademyDetailContext from "@contexts/academy";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademyProfile: () => <div data-testid="AcademyProfile" />,
}));

describe("<AcademyDetailLayout />", () => {
  const defaultContext = {
    academy: sampleAcademyDetail,
    programs: [],
    coaches: [],
    notices: [],
    reviews: undefined,
    loading: false,
    error: false,
    selectCoach: jest.fn(),
    selectNotice: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/information");
  });

  it("handles navigation", () => {
    jest
      .spyOn(AcademyDetailContext, "useAcademyDetail")
      .mockReturnValue(defaultContext);

    const { getByTestId } = renderWithProviders(<AcademyDetailLayout />);

    fireEvent.press(getByTestId("tab-programs"));
  });

  it("handles no academy", () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      ...defaultContext,
      academy: null,
    });

    renderWithProviders(<AcademyDetailLayout />);
  });
});
