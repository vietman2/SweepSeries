import { render } from "@testing-library/react";

import { Header } from "./Header";

jest.mock("react-slick", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("<Header />", () => {
  it("renders", () => {
    render(<Header />);
  });
});
