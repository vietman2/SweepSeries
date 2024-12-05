import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { FAQDetail } from "./FAQDetail";
import { sampleFAQs } from "@data/apps";
import * as FAQsAPI from "@services/apps/faqs";
import { renderWithProviders } from "@utils/test-utils";

describe("<FAQDetail />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "confirm").mockReturnValue(true);
    jest.spyOn(Router, "useParams").mockReturnValue({ faqId: "1" });
    jest.spyOn(FAQsAPI, "getFAQ").mockResolvedValue(sampleFAQs[0]);
  });

  it("handles error correctly", async () => {
    jest.spyOn(FAQsAPI, "getFAQ").mockResolvedValue(null);
    renderWithProviders(<FAQDetail />);

    await waitFor(() => expect(screen.getByText("Error")).toBeInTheDocument());
  });

  it("handles delete and edit", async () => {
    jest.spyOn(FAQsAPI, "updateFAQ").mockResolvedValue(true);
    jest.spyOn(FAQsAPI, "deleteFAQ").mockResolvedValue(true);
    renderWithProviders(<FAQDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("수정하기"));
      fireEvent.change(screen.getByTestId("question-input"), {
        target: { value: "new question" },
      });
      fireEvent.change(screen.getByTestId("answer-input"), {
        target: { value: "new answer" },
      });
      fireEvent.click(screen.getByText("저장"));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("삭제하기"));
    });
  });

  it("handles edit and delete fail", async () => {
    jest.spyOn(FAQsAPI, "updateFAQ").mockResolvedValue(null);
    jest.spyOn(FAQsAPI, "deleteFAQ").mockResolvedValue(null);
    renderWithProviders(<FAQDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("수정하기"));
      fireEvent.click(screen.getByText("저장"));
      fireEvent.click(screen.getByText("취소"));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("삭제하기"));
    });
  });

  it("handles delete cancel", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);
    renderWithProviders(<FAQDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("삭제하기"));
    });
  });
});
