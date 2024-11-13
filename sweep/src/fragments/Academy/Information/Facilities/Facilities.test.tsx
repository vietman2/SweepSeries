import { fireEvent } from "@testing-library/react-native";

import { Facilities } from "./Facilities";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<Facilities />", () => {
  it("renders equipment", () => {
    const { getByTestId } = renderWithProviders(
      <Facilities facilities={sampleAcademyDetail.facilities} type="구비장비" />
    );

    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("hide"));
    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("저장"));
  });
  
  it("renders services", () => {
    const { getByTestId } = renderWithProviders(
      <Facilities facilities={sampleAcademyDetail.facilities} type="편의시설" />
    );

    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("hide"));
    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("저장"));
  });
});
