import { ComingSoon } from "./ComingSoon";
import { ErrorComponent } from "./Error";
import { Loading } from "./Loading";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Fallbacks");

describe("<ComingSoon />", () => {
  it("renders", () => {
    renderWithProviders(<ComingSoon />);
  });
});

describe("<ErrorComponent />", () => {
  it("renders", () => {
    renderWithProviders(<ErrorComponent onRefresh={jest.fn()} />);
  });
});

describe("<Loading />", () => {
  it("renders", () => {
    renderWithProviders(<Loading />);
  });
});
