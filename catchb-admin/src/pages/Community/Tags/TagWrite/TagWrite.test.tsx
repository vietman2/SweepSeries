import { fireEvent, screen, waitFor } from "@testing-library/react";

import { TagWrite } from "./TagWrite";
import * as TagsAPI from "@services/community/tags";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Tag", () => ({
  TagPreview: () => <div>TagPreview</div>,
}));

describe("<TagWrite />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("renders correctly and handles submit", () => {
    jest.spyOn(TagsAPI, "createTag").mockResolvedValue(true);
    renderWithProviders(<TagWrite />);

    waitFor(() => {
      fireEvent.change(screen.getByTestId("forum"), {
        target: { value: "드래프트" },
      });
      fireEvent.change(screen.getByTestId("label"), {
        target: { value: "태그 이름" },
      });
      fireEvent.change(screen.getByTestId("icon"), {
        target: { value: "아이콘 링크" },
      });
    });
    fireEvent.click(screen.getByText("추가하기"));
  });

  it("handles submit fail", () => {
    jest.spyOn(TagsAPI, "createTag").mockResolvedValue(null);
    renderWithProviders(<TagWrite />);

    fireEvent.click(screen.getByText("추가하기"));
  });
});
