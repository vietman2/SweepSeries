import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { TermsDetail } from "./TermsDetail";
import { sampleTerms } from "@data/apps";
import * as TermsAPI from "@services/apps/terms";
import { renderWithProviders } from "@utils/test-utils";

describe("<TermsDetail />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "confirm").mockReturnValue(true);
    jest.spyOn(Router, "useParams").mockReturnValue({ termId: "1" });
    jest.spyOn(TermsAPI, "getTerm").mockResolvedValue(sampleTerms[0]);
  });

  it("handles error correctly", async () => {
    jest.spyOn(TermsAPI, "getTerm").mockResolvedValue(null);
    renderWithProviders(<TermsDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("새로고침"));
    });
  });

  it("handles delete correctly", async () => {
    jest.spyOn(TermsAPI, "deleteTerm").mockResolvedValue(true);
    renderWithProviders(<TermsDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("약관 삭제하기"));
    });
  });

  it("handles delete fail", async () => {
    jest.spyOn(TermsAPI, "deleteTerm").mockResolvedValue(null);
    renderWithProviders(<TermsDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("약관 삭제하기"));
    });
  });

  it("handles delete cancel", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);
    renderWithProviders(<TermsDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("약관 삭제하기"));
    });
  });

  it("handles edit correctly", async () => {
    jest.spyOn(TermsAPI, "getTerm").mockResolvedValue(sampleTerms[1]);
    jest.spyOn(TermsAPI, "updateTerm").mockResolvedValue(true);
    renderWithProviders(<TermsDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("확인하기"));
      fireEvent.click(screen.getByText("닫기"));
      fireEvent.click(screen.getByText("확인하기"));
      fireEvent.change(screen.getByPlaceholderText("요약"), {
        target: { value: "요약" },
      });
      fireEvent.click(screen.getByText("수정하기"));
    });
  });

  it("renders no content and handles edit fail", async () => {
    jest
      .spyOn(TermsAPI, "getTerm")
      .mockResolvedValue({ ...sampleTerms[1], content: "" });
    jest.spyOn(TermsAPI, "updateTerm").mockResolvedValue(null);
    renderWithProviders(<TermsDetail />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("확인하기"));
      fireEvent.click(screen.getByText("수정하기"));
    });
  });
});
