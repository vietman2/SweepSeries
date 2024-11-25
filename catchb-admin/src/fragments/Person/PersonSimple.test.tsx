import { PersonSimple, PersonSimpleHeader } from "./PersonSimple";
import { samplePeople } from "@data/members";
import { renderWithProviders } from "@utils/test-utils";

describe("<PersonSimpleHeader />", () => {
  it("renders", () => {
    renderWithProviders(<PersonSimpleHeader />);
  });
});

describe("<PersonSimple />", () => {
  it("renders", () => {
    renderWithProviders(<PersonSimple person={samplePeople[0]} />);
  });
});
