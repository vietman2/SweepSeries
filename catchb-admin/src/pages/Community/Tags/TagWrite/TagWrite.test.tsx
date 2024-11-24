import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as Router from "react-router-dom";

import { TagWrite } from "./TagWrite";
import { sampleTags } from "@data/community";
import * as TagsAPI from "@services/community/tags";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Tag", () => ({
  TagPreview: () => <div>TagPreview</div>,
}));

describe("<TagWrite />: create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/community/tags",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest.spyOn(Router, "useParams").mockReturnValue({});
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

describe("<TagWrite />: edit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: "/community/tags/1/edit",
      search: "",
      hash: "",
      state: null,
      key: "testKey",
    });
    jest.spyOn(Router, "useParams").mockReturnValue({ tagId: "1" });
    jest.spyOn(TagsAPI, "getTag").mockResolvedValue(sampleTags[0]);
  });

  it("handles error correctly", async () => {
    jest.spyOn(TagsAPI, "getTag").mockResolvedValue(null);
    renderWithProviders(<TagWrite />);

    await waitFor(() => {
      expect(screen.getByText("뒤로가기")).toBeInTheDocument();
    });
    waitFor(() => fireEvent.click(screen.getByText("뒤로가기")));
  });

  it("handles no param correctly", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({});
    renderWithProviders(<TagWrite />);

    await waitFor(() => {
      expect(screen.getByText("뒤로가기")).toBeInTheDocument();
    });
  });

  it("renders correctly and handles submit", async () => {
    jest.spyOn(TagsAPI, "updateTag").mockResolvedValue(true);
    renderWithProviders(<TagWrite />);

    await waitFor(() => {
      expect(screen.getByText("태그 수정")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("수정하기"));
  });

  it("handles submit fail", async () => {
    jest.spyOn(TagsAPI, "updateTag").mockResolvedValue(null);
    renderWithProviders(<TagWrite />);

    await waitFor(() => {
      expect(screen.getByText("태그 수정")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("수정하기"));
  });
});
