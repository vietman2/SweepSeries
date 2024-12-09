import { ImagePreview } from "./ImagePreview";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Images");

describe("<ImagePreview />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <ImagePreview uri="https://example.com/image.jpg" />
        <ImagePreview
          uri="https://example.com/image.jpg"
          removeImage={jest.fn()}
        />
      </>
    );
  });
});
