import { fireEvent, waitFor } from "@testing-library/react-native";

import { Facilities } from "./Facilities";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<Facilities />", () => {
  it("renders equipment", () => {
    renderWithProviders(
      <Facilities
        facilities={sampleAcademyDetail.convenience}
        options={sampleAcademyDetail.convenience}
        type="구비장비"
      />
    );
  });

  it("renders services", async () => {
    jest.spyOn(AcademiesAPI, "updateFacilities").mockResolvedValue({});
    const { getByTestId } = renderWithProviders(
      <Facilities
        facilities={sampleAcademyDetail.convenience}
        options={sampleAcademyDetail.convenience}
        type="편의시설"
        edit
        onRefresh={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("hide"));
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("에어컨-choice"));
      fireEvent.press(getByTestId("에어컨-choice"));
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("handles exceptions", async () => {
    jest.spyOn(AcademiesAPI, "updateFacilities").mockResolvedValueOnce({});
    // 1. successful, but no refresh
    const { getByTestId } = renderWithProviders(
      <Facilities
        facilities={sampleAcademyDetail.convenience}
        options={sampleAcademyDetail.convenience}
        type="편의시설"
        edit
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("저장"));
    });

    // 2. failed
    jest.spyOn(AcademiesAPI, "updateFacilities").mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.press(getByTestId("open"));
      fireEvent.press(getByTestId("저장"));
    });
  });
});
