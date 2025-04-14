import { fireEvent } from "@testing-library/react-native";

import { NoticeBlock } from "./NoticeBlock";
import { sampleNotices } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<NoticeBlock />", () => {
  it("renders and handles back", () => {
    const { getByTestId } = renderWithProviders(
      <NoticeBlock notice={sampleNotices[0]} />
    );

    fireEvent.press(getByTestId("back-button"));
  });
});
