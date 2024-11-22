import { fireEvent, screen } from "@testing-library/react";

import { Menu } from "./Menu";
import { renderWithProviders } from "@utils/test-utils";

describe("<Menu />", () => {
  const options = [
    { label: "Option 1", onClick: jest.fn() },
    { label: "Option 2", onClick: jest.fn() },
  ];

  it("should render and handle click outside", () => {
    renderWithProviders(
      <Menu options={options} isOpen={true} toggleDropdown={jest.fn()} />
    );

    fireEvent.click(screen.getByTestId("menu"));
    fireEvent.mouseDown(document);
  });

  it("should render closed", () => {
    renderWithProviders(
      <Menu options={options} isOpen={false} toggleDropdown={jest.fn()} small />
    );
  });
});
