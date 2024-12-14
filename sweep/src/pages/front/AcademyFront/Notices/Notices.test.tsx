import { fireEvent } from "@testing-library/react-native";

import { NoticeManagement } from "./Notices";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Notice", () => ({
  NoticeSimple: () => <div data-testid="notice-simple" />,
}));

describe("<NoticeManagement />", () => {
  it("should render notice simple", () => {
    const { getByTestId } = renderWithProviders(<NoticeManagement />);

    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("hide"));
    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("저장"));
  });
});
