import { render } from "@testing-library/react";

import App from "./App";

jest.mock("@pages/Login", () => ({
  Login: () => <div>Login</div>,
}));

describe("<App />", () => {
  it("renders without crashing", () => {
    render(<App />);
  });
});
