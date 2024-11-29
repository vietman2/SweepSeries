import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { PostReportDetail } from "./PostReportDetail";
import { samplePostReports } from "@data/community";
import * as ReportsAPI from "@services/community/reports";
import { renderWithProviders } from "@utils/test-utils";

describe("<PostReportDetail />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useParams").mockReturnValue({ reportId: "1" });
    jest
      .spyOn(ReportsAPI, "getPostReportDetails")
      .mockResolvedValue(samplePostReports[0]);
  });

  it("handles error correctly", async () => {
    jest.spyOn(ReportsAPI, "getPostReportDetails").mockResolvedValue(null);
    renderWithProviders(<PostReportDetail />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("renders processed report correctly", async () => {
    jest
      .spyOn(ReportsAPI, "getPostReportDetails")
      .mockResolvedValue({ ...samplePostReports[0], status: "처리완료" });
    renderWithProviders(<PostReportDetail />);

    await waitFor(() =>
      expect(screen.getByText("게시글 신고 상세")).toBeInTheDocument()
    );
  });

  it("handles update correctly", async () => {
    jest.spyOn(ReportsAPI, "updatePostReport").mockResolvedValue(true);
    renderWithProviders(<PostReportDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText("승인"));
      fireEvent.click(screen.getByLabelText("거부"));
      fireEvent.click(screen.getByTestId("update"));
    });
  });

  it("handles update fail", async () => {
    jest.spyOn(ReportsAPI, "updatePostReport").mockResolvedValue(null);
    renderWithProviders(<PostReportDetail />);

    await waitFor(() => fireEvent.click(screen.getByTestId("update")));
  });
});
