import { waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import { NoticeDetail } from "./NoticeDetail";
import * as NoticesAPI from "@services/products/notices";
import { sampleNotices } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<NoticeDetail />", () => {
  beforeEach(() => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({ id: "1" });
  });

  it("renders without crashing", async () => {
    jest.spyOn(NoticesAPI, "getNotice").mockResolvedValue(sampleNotices[0]);

    const { getByText } = renderWithProviders(<NoticeDetail />);

    await waitFor(() =>
      expect(getByText(sampleNotices[0].updated_at)).toBeTruthy()
    );
  });

  it("renders api error", async () => {
    jest.spyOn(NoticesAPI, "getNotice").mockResolvedValue(null);

    renderWithProviders(<NoticeDetail />);
  });
});
