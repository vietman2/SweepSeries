import { ProfileImage } from "./ProfileImage";
import { renderWithProviders } from "@utils/test-utils";

describe("<ProfileImage />", () => {
  it("renders default correctly", () => {
    renderWithProviders(<ProfileImage />);
  });
  
  it("renders default correctly with edit option", () => {
    renderWithProviders(<ProfileImage edit size="large" />);
  });

  it("renders with image correctly", () => {
    renderWithProviders(<ProfileImage uri="https://example.com" />);
  });

  it("renders with image correctly with edit option", () => {
    renderWithProviders(<ProfileImage uri="https://example.com" edit size="large" />);
  });
});
