import { render } from "@testing-library/react-native";

import { Searchbar } from "./Searchbar";

jest.unmock("@components/Search");

describe("<Searchbar />", () => {
  it("renders correctly", () => {
    render(
      <Searchbar
        placeholder="Placeholder"
        value="Value"
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
  });
});
