import { AddMemo } from "./AddMemo";
import { renderWithProviders } from "@utils/test-utils";

describe("<AddMemo />", () => {
  it("renders correctly", () => {
    renderWithProviders(<AddMemo />);
  });
});
