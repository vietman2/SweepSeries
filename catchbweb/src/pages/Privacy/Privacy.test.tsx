import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { PrivacyPolicy } from "./Privacy";
import * as TermsAPI from "@services/terms/terms";

jest.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe("<PrivacyPolicy />", () => {
  it("renders correctly and handles select", async () => {
    jest.spyOn(TermsAPI, "getPrivacyPolicy").mockResolvedValue({
      versions: [
        {
          id: 1,
          created_at: "2021-01-01",
          summary: "Summary 1",
        },
      ],
      content: "Content",
    });
    render(<PrivacyPolicy />);

    await waitFor(() => {
      expect(screen.getByText("2021-01-01")).toBeInTheDocument();
      fireEvent.change(screen.getByTestId("version-select"), {
        target: { value: "0" },
      });
    });
  });

  it("handles api error", async () => {
    jest.spyOn(TermsAPI, "getPrivacyPolicy").mockResolvedValue(null);
    render(<PrivacyPolicy />);
  });
});
