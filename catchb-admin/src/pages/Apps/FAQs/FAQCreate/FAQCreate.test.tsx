import { fireEvent, screen, waitFor } from "@testing-library/react";

import { FAQCreate } from "./FAQCreate";
import * as FAQsAPI from "@services/apps/faqs";
import { renderWithProviders } from "@utils/test-utils";

describe("<FAQCreate />", () => {
  it("handles create", async () => {
    jest.spyOn(FAQsAPI, "createFAQ").mockResolvedValue(true);
    renderWithProviders(<FAQCreate />);

    await waitFor(() => {
      fireEvent.change(screen.getByTestId("category-select"), {
        target: { value: "아카데미" },
      });
      fireEvent.change(screen.getByTestId("question-input"), {
        target: { value: "질문" },
      });
      fireEvent.change(screen.getByTestId("answer-input"), {
        target: { value: "답변" },
      });
      fireEvent.click(screen.getByText("등록"));
    });
  });

  it("handles create fail", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(FAQsAPI, "createFAQ").mockResolvedValue(null);
    renderWithProviders(<FAQCreate />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("등록"));
    });
  });
});
