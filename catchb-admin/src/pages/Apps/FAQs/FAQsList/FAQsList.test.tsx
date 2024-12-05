import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { FAQsList } from "./FAQsList";
import { sampleFAQs } from "@data/apps";
import * as FAQsAPI from "@services/apps/faqs";
import { renderWithProviders } from "@utils/test-utils";

describe("<FAQsList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/apps/faqs",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest.spyOn(FAQsAPI, "getFAQs").mockResolvedValue(sampleFAQs);
  });

  it("handles error correctly", async () => {
    jest.spyOn(FAQsAPI, "getFAQs").mockResolvedValue(null);
    renderWithProviders(<FAQsList />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("handles filters and navigate correctly", async () => {
    renderWithProviders(<FAQsList />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("전체"));
      fireEvent.click(screen.getByText("FAQ 추가"));
      fireEvent.click(screen.getByTestId("faq-1"));
    });
  });

  it("renders in the background", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/apps/faqs/1",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    waitFor(() => renderWithProviders(<FAQsList />));
  });
});
