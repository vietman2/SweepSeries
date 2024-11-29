import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

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
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/community/tags",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest.spyOn(TagsAPI, "getTags").mockResolvedValue({
      덕아웃: sampleTags,
      드래프트: [],
      마켓: [],
      스틸: [],
    });
  });

  it("handles API error correctly", async () => {
    jest.spyOn(TagsAPI, "getTags").mockResolvedValue(null);
    renderWithProviders(<TagList />);

    await waitFor(() => {
      expect(screen.getByText("새로고침")).toBeInTheDocument();
    });
    waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("handles background render correctly", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/community/tags/create",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    waitFor(() => renderWithProviders(<TagList />));
  });

  it("renders correctly and handles navigations", async () => {
    renderWithProviders(<TagList />);

    await waitFor(() => {
      expect(screen.getByText("태그 추가")).toBeInTheDocument();
    });

    waitFor(() => fireEvent.click(screen.getByText("태그 추가")));
  });

  it("renders correctly and handles navigations", async () => {
    jest.spyOn(TagsAPI, "getTags").mockResolvedValue({
      덕아웃: [sampleTags[0]],
      드래프트: [sampleTags[1]],
      마켓: [sampleTags[2]],
      스틸: [sampleTags[3]],
    });
    renderWithProviders(<TagList />);

    await waitFor(() => {
      expect(screen.getByText("태그 추가")).toBeInTheDocument();
    });

    waitFor(() => {
      fireEvent.click(screen.getByTestId("tag-chip-1"));
      fireEvent.click(screen.getByTestId("tag-chip-2"));
      fireEvent.click(screen.getByTestId("tag-chip-3"));
      fireEvent.click(screen.getByTestId("tag-chip-4"));
    });
  });
});
