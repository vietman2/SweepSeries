import { fireEvent, screen } from "@testing-library/react";

import { TextInput } from "./TextInput";
import { renderWithProviders } from "@utils/test-utils";

describe("<TextInput />", () => {
  it("renders an input element", () => {
    renderWithProviders(
      <TextInput placeholder="Username" value="" onChange={() => {}} />
    );

    fireEvent.change(screen.getByTestId("text-input"), {
      target: { value: "test" },
    });
  });

  it("renders an password input element", () => {
    renderWithProviders(
      <TextInput placeholder="Username" value="" onChange={() => {}} password />
    );

    fireEvent.change(screen.getByTestId("text-input"), {
      target: { value: "test" },
    });
  });
});
