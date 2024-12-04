import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { NoticesList } from "./NoticesList";
import { sampleNotices } from "@data/apps";
import * as NoticesAPI from "@services/apps/notices";
import { renderWithProviders } from "@utils/test-utils";

describe("<NoticesList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/apps/notices",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(sampleNotices);
  });

  it("handles error correctly", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(null);
    renderWithProviders(<NoticesList />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("handles navigate", async () => {
    renderWithProviders(<NoticesList />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("notice-1"));
      fireEvent.click(screen.getByText("공지 추가"));
    });
  });

  it("renders in the background", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/apps/notices/1/",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    renderWithProviders(<NoticesList />);
  });
});
