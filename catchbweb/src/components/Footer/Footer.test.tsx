import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { Footer } from "./Footer";
import { sampleNotices } from "@constants/notice";
import * as NoticesAPI from "@services/notices/notices";

jest.mock("@assets/naver.svg", () => "naver.svg");
jest.mock("@assets/instragram.svg", () => "instragram.svg");

describe("<Footer />", () => {
  beforeEach(() => {
    jest.spyOn(window, "open").mockImplementation();
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(sampleNotices);
  });

  it("renders Footer component", async () => {
    render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Footer />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByAltText("인스타그램"));
    fireEvent.click(screen.getByAltText("네이버 블로그"));
    fireEvent.click(screen.getByText("서비스 이용약관"));
    fireEvent.click(screen.getByText("개인정보 처리방침"));

    await waitFor(() =>
      expect(screen.getByText(sampleNotices[0].title)).toBeInTheDocument()
    );
  });

  it("handles API error", async () => {
    jest.spyOn(NoticesAPI, "getNotices").mockResolvedValue(null);
    render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Footer />
      </BrowserRouter>
    );
  });
});
