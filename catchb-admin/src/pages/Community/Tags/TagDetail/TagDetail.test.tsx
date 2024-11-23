import { fireEvent, screen, waitFor } from "@testing-library/react";

import { TagDetail } from "./TagDetail";
import { sampleTags } from "@data/community";
import * as TagsAPI from "@services/community/tags";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Tag", () => ({
  TagChip: () => <div data-testid="tag-chip"></div>,
}));

describe("<TagDetail />", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "confirm").mockImplementation(() => true);
    jest.spyOn(TagsAPI, "getTag").mockResolvedValue(sampleTags[0]);
    jest.spyOn(TagsAPI, "deleteTag").mockResolvedValue(true);
  });

  it("should handle API error", async () => {
    jest.spyOn(TagsAPI, "getTag").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<TagDetail />));

    await waitFor(() =>
      expect(screen.getByText("새로고침")).toBeInTheDocument()
    );
    waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("should render and handles navigate to edit", async () => {
    waitFor(() => renderWithProviders(<TagDetail />));

    await waitFor(() =>
      expect(screen.getByText("태그 상세")).toBeInTheDocument()
    );
    waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("수정하기"));
    });
  });

  it("handles delete correctly", async () => {
    waitFor(() => renderWithProviders(<TagDetail />));

    await waitFor(() =>
      expect(screen.getByText("태그 상세")).toBeInTheDocument()
    );
    waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("삭제하기"));
    });
  });

  it("handles delete fail correctly", async () => {
    jest.spyOn(TagsAPI, "deleteTag").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<TagDetail />));

    await waitFor(() =>
      expect(screen.getByText("태그 상세")).toBeInTheDocument()
    );
    waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("삭제하기"));
    });
  });

  it("handles delete cancel correctly", async () => {
    jest.spyOn(window, "confirm").mockImplementation(() => false);
    waitFor(() => renderWithProviders(<TagDetail />));

    await waitFor(() =>
      expect(screen.getByText("태그 상세")).toBeInTheDocument()
    );
    waitFor(() => {
      fireEvent.click(screen.getByTestId("toggle"));
      fireEvent.click(screen.getByText("삭제하기"));
    });
  });
});
