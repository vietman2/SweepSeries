import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { TermsOfService } from "./Terms";
import * as TermsAPI from "@services/terms/terms";

jest.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe("<TermsOfService />", () => {
  it("renders correctly and handles select", async () => {
    jest.spyOn(TermsAPI, "getTermsOfService").mockResolvedValue({
      versions: [
        {
          id: 1,
          created_at: "2021-01-01",
          summary: "Summary 1",
        },
      ],
      content: "Content",
    });
    render(<TermsOfService />);

    await waitFor(() => {
      expect(screen.getByText("2021-01-01")).toBeInTheDocument();
      fireEvent.change(screen.getByTestId("version-select"), {
        target: { value: "0" },
      });
    });
  });

  it("handles api error", async () => {
    jest.spyOn(TermsAPI, "getTermsOfService").mockResolvedValue(null);
    render(<TermsOfService />);
  });
});
