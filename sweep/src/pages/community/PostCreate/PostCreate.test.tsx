import { fireEvent, waitFor } from "@testing-library/react-native";

import { PostCreate } from "./PostCreate";
import * as PostsAPI from "@services/community/posts";
import * as TagsAPI from "@services/community/tags";
import { sampleTagResponse } from "@testdata/community";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));
jest.mock("@fragments/Post", () => ({
  Tag: () => null,
}));

describe("<PostCreate />", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(TagsAPI, "getTags").mockResolvedValue(sampleTagResponse);
  });

  it("handles bad response", async () => {
    jest.spyOn(TagsAPI, "getTags").mockResolvedValue(null);

    const { getByTestId } = renderWithProviders(<PostCreate />);

    await waitFor(() => fireEvent.press(getByTestId("error")));
  });

  it("renders and handles create post", async () => {
    jest.spyOn(PostsAPI, "createPost").mockResolvedValue({ id: "1" });
    const { getByTestId } = await waitFor(() =>renderWithProviders(<PostCreate />));

    waitFor(() => {
      fireEvent.press(getByTestId("드래프트"));
      fireEvent.press(getByTestId("덕아웃"));
      fireEvent.press(getByTestId("KBO"));
      fireEvent.press(getByTestId("등록"));
    });
  });

  it("handles create fail", async () => {
    jest.spyOn(PostsAPI, "createPost").mockResolvedValue(null);
    const { getByTestId } = await waitFor(() =>
      renderWithProviders(<PostCreate />)
    );

    waitFor(() => {
      fireEvent.press(getByTestId("등록"));
    });
  });
});
