import { fireEvent, waitFor } from "@testing-library/react-native";

import { PopupMenu } from "./PopupMenu";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Menus");

describe("<PopupMenu />", () => {
  const items = [
    { label: "Item 1", onPress: jest.fn() },
    { label: "Item 2", onPress: jest.fn() },
  ];

  it("renders items correctly and item press", async () => {
    const { getByTestId, getByText } = renderWithProviders(
      <PopupMenu items={items}>
        <></>
      </PopupMenu>
    );

    fireEvent.press(getByTestId("open"), { nativeEvent: { pageX: 100, pageY: 100 } });
    await waitFor(() => fireEvent.press(getByText("Item 1")));
  });

  it("renders items overflow correctly", async () => {
    const { getByTestId, getByText } = renderWithProviders(
      <PopupMenu items={items}>
        <></>
      </PopupMenu>
    );

    fireEvent.press(getByTestId("open"), {
      nativeEvent: { pageX: 2000, pageY: 2000 },
    });
    await waitFor(() => fireEvent.press(getByText("Item 1")));
  });
});
