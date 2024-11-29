import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { PostReportList } from "./PostReportList";
import { samplePostReports } from "@data/community";
import * as ReportsAPI from "@services/community/reports";
import { renderWithProviders } from "@utils/test-utils";

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

  it("renders correctly", async () => {
    renderWithProviders(<PostReportList />);

    await waitFor(() => fireEvent.click(screen.getByTestId("report-1")));
  });

  it("handles error correctly", async () => {
    jest.spyOn(ReportsAPI, "getPostReports").mockResolvedValue(null);
    renderWithProviders(<PostReportList />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
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

    await waitFor(() => fireEvent.click(screen.getByText("Loading")));
  });
});
