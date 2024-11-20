import { fireEvent, screen } from "@testing-library/react";

import { Login } from "./Login";
import { renderWithProviders } from "@utils/test-utils";

describe("<Login />", () => {
  it("renders without crashing", () => {
    renderWithProviders(<Login />);

    fireEvent.click(screen.getByText("로그인"));
  });
});
