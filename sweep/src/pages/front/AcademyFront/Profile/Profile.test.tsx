import { waitFor } from "@testing-library/react-native";

import { ProfileManagement } from "./Profile";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademyProfile: () => <div>AcademyProfile</div>,
  Facilities: () => <div>Facilities</div>,
  Introduction: () => <div>Introduction</div>,
  WorkingHours: () => <div>WorkingHours</div>,
}));

describe("<ProfileManagement />", () => {
  it("renders correctly", async () => {
    jest.spyOn(AcademiesAPI, "getFacilityOptions").mockResolvedValue([]);
    const { getByText } = renderWithProviders(<ProfileManagement academy={sampleAcademyDetail} />);

    await waitFor(() => expect(getByText("지도")).toBeTruthy());
  });

  it("handles bad response correctly", async () => {
    jest.spyOn(AcademiesAPI, "getFacilityOptions").mockResolvedValue(null);
    const { getByText } = renderWithProviders(
      <ProfileManagement academy={sampleAcademyDetail} />
    );

    await waitFor(() => expect(getByText("지도")).toBeTruthy());
  });
});
