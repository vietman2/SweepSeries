import { fireEvent } from "@testing-library/react-native";
import * as Router from "expo-router";

import { AcademyDetailLayout } from "./AcademyDetailLayout";
import * as AcademyDetailContext from "@contexts/academy";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  Slot: () => <div data-testid="Slot" />,
  router: {
    replace: jest.fn(),
  },
  usePathname: jest.fn(),
}));
jest.mock("@fragments/Academy", () => ({
  AcademyProfile: () => <div data-testid="AcademyProfile" />,
}));

describe("<AcademyDetailLayout />", () => {
  beforeEach(() => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/information");
  });

  it("handles navigation", () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: sampleAcademyDetail,
      showDetailPage: false,
      selectCoach: jest.fn(),
      selectNotice: jest.fn(),
    });

    const { getByTestId } = renderWithProviders(<AcademyDetailLayout />);

    fireEvent.press(getByTestId("tab-programs"));
  });

  it("handles detail page", () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: sampleAcademyDetail,
      showDetailPage: true,
      selectCoach: jest.fn(),
      selectNotice: jest.fn(),
    });

    renderWithProviders(<AcademyDetailLayout />);
  });

  it("handles no academy", () => {
    jest.spyOn(AcademyDetailContext, "useAcademyDetail").mockReturnValue({
      academy: null,
      showDetailPage: false,
      selectCoach: jest.fn(),
      selectNotice: jest.fn(),
    });

    renderWithProviders(<AcademyDetailLayout />);
  });
});
