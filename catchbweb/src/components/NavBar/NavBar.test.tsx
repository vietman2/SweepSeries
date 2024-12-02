import { render } from "@testing-library/react";

import { NavBar } from "./NavBar";

jest.mock("@assets/catchb.svg", () => "catchb.svg");

describe("<NavBar />", () => {
  it("renders", () => {
    render(<NavBar />);
  });
});
