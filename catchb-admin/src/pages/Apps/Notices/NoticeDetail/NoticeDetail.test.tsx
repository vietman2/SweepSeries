import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { NoticeDetail } from "./NoticeDetail";
import { sampleNotices } from "@data/apps";
import * as NoticesAPI from "@services/apps/notices";
import { renderWithProviders } from "@utils/test-utils";

describe("<NoticeDetail />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "confirm").mockReturnValue(true);
    jest.spyOn(Router, "useParams").mockReturnValue({ noticeId: "1" });
    jest.spyOn(NoticesAPI, "getNotice").mockResolvedValue(sampleNotices[0]);
  });

  it("handles error correctly", async () => {
    jest.spyOn(NoticesAPI, "getNotice").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<NoticeDetail />));

    await waitFor(() => expect(screen.getByText("Error")).toBeInTheDocument());
  });

  it("handles delete", async () => {
    jest.spyOn(NoticesAPI, "deleteNotice").mockResolvedValue(true);
    waitFor(() => renderWithProviders(<NoticeDetail />));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("삭제하기"));
    });
  });

  it("handles delete fail", async () => {
    jest.spyOn(NoticesAPI, "deleteNotice").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<NoticeDetail />));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("삭제하기"));
    });
  });

  it("handles delete cancel", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);
    waitFor(() => renderWithProviders(<NoticeDetail />));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("삭제하기"));
    });
  });

  it("handles edit", async () => {
    jest.spyOn(NoticesAPI, "updateNotice").mockResolvedValue(true);
    waitFor(() => renderWithProviders(<NoticeDetail />));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("수정하기"));
      fireEvent.click(screen.getByText("취소"));
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("수정하기"));
      fireEvent.change(screen.getByTestId("title-input"), {
        target: { value: "new title" },
      });
      fireEvent.change(screen.getByTestId("content-input"), {
        target: { value: "new content" },
      });
      fireEvent.click(screen.getByText("저장"));
    });
  });

  it("handles edit fail", async () => {
    jest.spyOn(NoticesAPI, "updateNotice").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<NoticeDetail />));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("수정하기"));
      fireEvent.click(screen.getByText("저장"));
    });
  });
});
