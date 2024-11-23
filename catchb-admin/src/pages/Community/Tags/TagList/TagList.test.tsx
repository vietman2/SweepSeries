import { fireEvent, screen, waitFor } from "@testing-library/react";

import { TagList } from "./TagList";
import { sampleTags } from "@data/community";
import * as TagsAPI from "@services/community/tags";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Tag", () => ({
  TagChip: () => <div data-testid="tag-chip" />,
}));

describe("<TagList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(TagsAPI, "getTags").mockResolvedValue({ 덕아웃: sampleTags });
  });

  it("handles API error correctly", async () => {
    jest.spyOn(TagsAPI, "getTags").mockResolvedValue(null);
    renderWithProviders(<TagList />);

    await waitFor(() => {
      expect(screen.getByText("새로고침")).toBeInTheDocument();
    });
    waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("renders correctly", async () => {
    renderWithProviders(<TagList />);

    await waitFor(() => {
      expect(screen.getByText("태그 추가")).toBeInTheDocument();
    });

    waitFor(() => {
      fireEvent.click(screen.getByText("태그 추가"));
      fireEvent.click(screen.getByTestId("tag-chip-1"));
    });
  });
});
