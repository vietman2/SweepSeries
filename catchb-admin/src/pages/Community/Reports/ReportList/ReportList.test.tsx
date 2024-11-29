import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import {
  PostReportList,
  CommentReportList,
  ReCommentReportList,
} from "./ReportList";
import * as ReportsAPI from "@services/community/reports";
import { renderWithProviders } from "@utils/test-utils";
import {
  sampleCommentReports,
  samplePostReports,
  sampleReCommentReports,
} from "@data/community";

describe("<PostReportList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/community/reports/posts",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest
      .spyOn(ReportsAPI, "getPostReports")
      .mockResolvedValue(samplePostReports);
  });

  it("handles error correctly", async () => {
    jest.spyOn(ReportsAPI, "getPostReports").mockResolvedValue(null);
    renderWithProviders(<PostReportList />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("renders without crashing", async () => {
    renderWithProviders(<PostReportList />);

    await waitFor(() => fireEvent.click(screen.getByTestId("report-1")));
  });

  it("renders in the background", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/community/reports/posts/1",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    renderWithProviders(<PostReportList />);

    await waitFor(() => expect(screen.getByText("Loading")).toBeInTheDocument());
  });
});

describe("<CommentReportList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/community/reports/comments",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest
      .spyOn(ReportsAPI, "getCommentReports")
      .mockResolvedValue(sampleCommentReports);
  });

  it("handles error correctly", async () => {
    jest.spyOn(ReportsAPI, "getCommentReports").mockResolvedValue(null);
    renderWithProviders(<CommentReportList />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("renders without crashing", async () => {
    renderWithProviders(<CommentReportList />);

    await waitFor(() => fireEvent.click(screen.getByTestId("report-1")));
  });
});

describe("<ReCommentReportList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/community/reports/recomments",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest
      .spyOn(ReportsAPI, "getReCommentReports")
      .mockResolvedValue(sampleReCommentReports);
  });

  it("handles error correctly", async () => {
    jest.spyOn(ReportsAPI, "getReCommentReports").mockResolvedValue(null);
    renderWithProviders(<ReCommentReportList />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("renders without crashing", async () => {
    renderWithProviders(<ReCommentReportList />);

    await waitFor(() => fireEvent.click(screen.getByTestId("report-1")));
  });
});
