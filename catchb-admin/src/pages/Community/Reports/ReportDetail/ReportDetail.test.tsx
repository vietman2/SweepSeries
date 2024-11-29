import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import {
  PostReportDetail,
  CommentReportDetail,
  ReCommentReportDetail,
} from "./ReportDetail";
import * as ReportsAPI from "@services/community/reports";
import { renderWithProviders } from "@utils/test-utils";
import {
  samplePostReports,
  sampleCommentReports,
  sampleReCommentReports,
} from "@data/community";

describe("<PostReportDetail />", () => {
  beforeEach(() => {
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

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("update"));
    });
  });

  it("handles already done", async () => {
    jest
      .spyOn(ReportsAPI, "getPostReportDetails")
      .mockResolvedValue({ ...samplePostReports[0], status: "처리완료" });
    renderWithProviders(<PostReportDetail />);

    await waitFor(() => expect(screen.getByText("처리완료")).toBeInTheDocument());
  });
});

describe("<CommentReportDetail />", () => {
  beforeEach(() => {
    jest.spyOn(Router, "useParams").mockReturnValue({ reportId: "1" });
    jest
      .spyOn(ReportsAPI, "getCommentReportDetails")
      .mockResolvedValue(sampleCommentReports[0]);
  });

  it("handles error correctly", async () => {
    jest.spyOn(ReportsAPI, "getCommentReportDetails").mockResolvedValue(null);
    renderWithProviders(<CommentReportDetail />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("handles update correctly", async () => {
    jest.spyOn(ReportsAPI, "updateCommentReport").mockResolvedValue(true);
    renderWithProviders(<CommentReportDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText("승인"));
      fireEvent.click(screen.getByLabelText("거부"));
      fireEvent.click(screen.getByTestId("update"));
    });
  });

  it("handles update fail", async () => {
    jest.spyOn(ReportsAPI, "updateCommentReport").mockResolvedValue(null);
    renderWithProviders(<CommentReportDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("update"));
    });
  });
});

describe("<ReCommentReportDetail />", () => {
  beforeEach(() => {
    jest.spyOn(Router, "useParams").mockReturnValue({ reportId: "1" });
    jest
      .spyOn(ReportsAPI, "getReCommentReportDetails")
      .mockResolvedValue(sampleReCommentReports[0]);
  });

  it("handles error correctly", async () => {
    jest.spyOn(ReportsAPI, "getReCommentReportDetails").mockResolvedValue(null);
    renderWithProviders(<ReCommentReportDetail />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("handles update correctly", async () => {
    jest.spyOn(ReportsAPI, "updateReCommentReport").mockResolvedValue(true);
    renderWithProviders(<ReCommentReportDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText("승인"));
      fireEvent.click(screen.getByLabelText("거부"));
      fireEvent.click(screen.getByTestId("update"));
    });
  });

  it("handles update fail", async () => {
    jest.spyOn(ReportsAPI, "updateReCommentReport").mockResolvedValue(null);
    renderWithProviders(<ReCommentReportDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("update"));
    });
  });
});
