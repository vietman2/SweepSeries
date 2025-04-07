import { fireEvent } from "@testing-library/react-native";

import { HomeLayout } from "./HomeLayout";
import { renderWithProviders } from "@utils/test-utils";

describe("<HomeLayout />", () => {
  it("renders without crashing", () => {
    const { getByTestId } = renderWithProviders(<HomeLayout />);

    fireEvent.press(getByTestId("back-button"));
  });
});
