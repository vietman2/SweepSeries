import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { TermsList } from "./TermsList";
import { sampleTerms } from "@data/apps";
import * as TermsAPI from "@services/apps/terms";
import { renderWithProviders } from "@utils/test-utils";

describe("<TermsList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/apps/terms",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest.spyOn(TermsAPI, "getTerms").mockResolvedValue(sampleTerms);
  });

  it("handles API error correctly", async () => {
    jest.spyOn(TermsAPI, "getTerms").mockResolvedValue(null);
    renderWithProviders(<TermsList />);

    await waitFor(() => {
      expect(screen.getByText("새로고침")).toBeInTheDocument();
    });
    waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("handles background render correctly", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/apps/terms/create",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    waitFor(() => renderWithProviders(<TermsList />));
  });

  it("renders correctly and handles navigations", async () => {
    renderWithProviders(<TermsList />);

    await waitFor(() => {
      expect(screen.getByText("약관 추가")).toBeInTheDocument();
    });

    waitFor(() => {
      fireEvent.click(screen.getByText("약관 추가"));
      fireEvent.click(screen.getByTestId("term-1"));
    });
  });
});
