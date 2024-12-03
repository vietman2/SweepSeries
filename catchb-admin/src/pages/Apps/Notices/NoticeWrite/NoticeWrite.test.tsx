import { fireEvent, screen } from "@testing-library/react";

import { NoticeWrite } from "./NoticeWrite";
import * as NoticesAPI from "@services/apps/notices";
import { renderWithProviders } from "@utils/test-utils";

describe("<NoticeWrite />", () => {
  it("handles create", () => {
    jest.spyOn(NoticesAPI, "createNotice").mockResolvedValue(true);
    renderWithProviders(<NoticeWrite />);

    fireEvent.change(screen.getByPlaceholderText("제목을 입력하세요"), {
      target: { value: "제목" },
    });
    fireEvent.change(screen.getByPlaceholderText("내용을 입력하세요"), {
      target: { value: "내용" },
    });
    fireEvent.click(screen.getByText("등록"));
  });
  
  it("handles create fail", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(NoticesAPI, "createNotice").mockResolvedValue(null);
    renderWithProviders(<NoticeWrite />);

    fireEvent.click(screen.getByText("등록"));
  });
});
