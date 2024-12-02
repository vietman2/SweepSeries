import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { Footer } from "./Footer";

jest.mock("@assets/naver.svg", () => "naver.svg");
jest.mock("@assets/instragram.svg", () => "instragram.svg");

describe("<Footer />", () => {
  beforeAll(() => {
    jest.spyOn(window, "open").mockImplementation();
  });

  it("renders Footer component", () => {
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
  });
});
