import { fireEvent, screen, waitFor } from "@testing-library/react";

import { TermsCreate } from "./TermsCreate";
import * as TermsAPI from "@services/apps/terms";
import { renderWithProviders } from "@utils/test-utils";


jest.mock("@components/Inputs", () => {
  const { forwardRef } = jest.requireActual("react");

  const mockRef = jest.fn().mockImplementation(() => {
    return { current: { getEditor: jest.fn(() => ({ getText: jest.fn() })) } };
  });

  return {
    ContentInput: forwardRef(({}, ref: React.RefObject<HTMLDivElement>) => (
      <div ref={mockRef} data-testid="content" />
    )),
  };
});

describe("<TermsCreate />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("handles submit with content", async () => {
    jest.spyOn(TermsAPI, "createTerms").mockResolvedValue(true);
    renderWithProviders(<TermsCreate />);

    await waitFor(() => {
      fireEvent.change(screen.getByTestId("label"), {
        target: { value: "title" },
      });
      fireEvent.click(screen.getByTestId("create"));
    });
  });

  it("handles submit fail without content", async () => {
    jest.spyOn(TermsAPI, "createTerms").mockResolvedValue(null);
    renderWithProviders(<TermsCreate />);

    await waitFor(() => {
      fireEvent.change(screen.getByTestId("label"), {
        target: { value: "title" },
      });
      fireEvent.click(screen.getByTestId("isRequired"));
      fireEvent.click(screen.getByTestId("hasContent"));
      fireEvent.click(screen.getByTestId("create"));
    });
  });
});
