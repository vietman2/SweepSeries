import { fireEvent } from "@testing-library/react-native";
import * as IPicker from "expo-image-picker";

import { ReviewInputs } from "./ReviewInputs";
import { sampleTagOptions } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<ReviewInputs />", () => {
  const defaultValues = {
    rating: 5,
    comment: "comment comment",
    images: [],
    tagIds: [1],
  };

  const imageAssets = [
    {
      uri: "uri1",
      width: 100,
      height: 100,
    },
    {
      uri: "uri2",
      width: 100,
      height: 100,
    },
  ];

  it("renders type 1, select images and select high rating", async () => {
    jest
      .spyOn(IPicker, "launchImageLibraryAsync")
      .mockResolvedValue({ canceled: false, assets: imageAssets });

    const { getByTestId } = renderWithProviders(
      <ReviewInputs
        type={1}
        values={{ ...defaultValues, rating: 1 }}
        setValues={jest.fn()}
        tagOptions={sampleTagOptions.lesson}
      />
    );

    fireEvent.press(getByTestId("rating-1"));
    fireEvent.press(getByTestId("rating-2"));
    fireEvent.press(getByTestId("tag-3"));
    fireEvent.press(getByTestId("select-image"));
  });

  it("renders type 2 and long comment, set comments and remove images", () => {
    const longComment = "a".repeat(1000);

    const { getAllByTestId, getByTestId } = renderWithProviders(
      <ReviewInputs
        type={2}
        values={{
          ...defaultValues,
          rating: 0,
          comment: longComment,
          images: imageAssets,
          secure: true,
        }}
        setValues={jest.fn()}
        tagOptions={sampleTagOptions.coach}
      />
    );

    fireEvent.changeText(getByTestId("comment-input"), "new comment");
    fireEvent.press(getAllByTestId("remove-image")[0]);
    fireEvent.press(getByTestId("secure"));
  });

  it("renders type 3, deselect tags, select image cancel and select low raing", () => {
    jest
      .spyOn(IPicker, "launchImageLibraryAsync")
      .mockResolvedValue({ canceled: true, assets: null });

    const { getByTestId } = renderWithProviders(
      <ReviewInputs
        type={3}
        values={defaultValues}
        setValues={jest.fn()}
        tagOptions={sampleTagOptions.academy}
      />
    );

    fireEvent.press(getByTestId("rating-3"));
    fireEvent.press(getByTestId("rating-4"));
    fireEvent.press(getByTestId("rating-5"));
    fireEvent.press(getByTestId("select-image"));
    fireEvent.press(getByTestId("tag-1")); // deselect tag
  });
});
