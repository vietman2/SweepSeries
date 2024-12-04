import { waitFor } from "@testing-library/react-native";

import { Bulletin } from "./Bulletin";
import * as AnnouncementsAPI from "@services/app/announcements";
import { sampleAnnouncements } from "@testdata/customers";
import { renderWithProviders } from "@utils/test-utils";

describe("<Bulletin />", () => {
  it("renders correctly", async () => {
    jest
      .spyOn(AnnouncementsAPI, "getAnnouncements")
      .mockResolvedValue(sampleAnnouncements);
    const { getByText } = renderWithProviders(<Bulletin />);

    await waitFor(() =>
      expect(getByText(sampleAnnouncements[0].title)).toBeTruthy()
    );
  });

  it("handles error correctly", async () => {
    jest.spyOn(AnnouncementsAPI, "getAnnouncements").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<Bulletin />));
  });
});
