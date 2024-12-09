import { render } from "@testing-library/react-native";

import { SearchAddress } from "./SearchAddress";
import { Searchbar } from "./Searchbar";

jest.unmock("@components/Search");

describe("<SearchAddress />", () => {
  it("renders correctly", () => {
    render(
      <>
        <SearchAddress
          address1="Address1"
          address2="Address2"
          onChangeText={jest.fn()}
          onButtonPress={jest.fn()}
        />
        <SearchAddress
          address1=""
          address2="Address2"
          onChangeText={jest.fn()}
          onButtonPress={jest.fn()}
        />
      </>
    );
  });
});

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
