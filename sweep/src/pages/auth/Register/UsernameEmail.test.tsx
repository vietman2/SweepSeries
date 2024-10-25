import { fireEvent } from "@testing-library/react-native";

import { UsernameEmail } from "./UsernameEmail";
import { renderWithProviders } from "@utils/test-utils";

describe("<UsernameEmail />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(<UsernameEmail />);

    fireEvent.press(getByTestId("다음으로"));
  });
});
