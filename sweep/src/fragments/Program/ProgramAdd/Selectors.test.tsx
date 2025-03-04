import { fireEvent } from "@testing-library/react-native";

import { SingleSelect, MultiSelect } from "./Selectors";
import { timeOptions } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<SingleSelect />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(
      <SingleSelect
        options={timeOptions}
        selected={30}
        setSelected={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("30"));
  });
});

describe("<MultiSelect />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(
      <MultiSelect
        options={timeOptions}
        selected={[30]}
        setSelected={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("30"));
  });
});
