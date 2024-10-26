import { fireEvent } from "@testing-library/react-native";

import { ReportModal } from "./ReportModal";
import { renderWithProviders } from "@utils/test-utils";

describe("<ReportModal />", () => {
  it("renders and hide modal", () => {
    const { getByTestId } = renderWithProviders(
      <ReportModal
        visible
        setVisible={jest.fn()}
        content="asdf"
        onSubmit={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("hide"));
  });
  
  it("renders menu correctly", () => {
    const { getByTestId } = renderWithProviders(
      <ReportModal
        visible
        setVisible={jest.fn()}
        content="asdf"
        onSubmit={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("폭력/협박/위협"));
  });
  
  it("handles submit", () => {
    const { getByTestId } = renderWithProviders(
      <ReportModal
        visible
        setVisible={jest.fn()}
        content="asdf"
        onSubmit={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("신고하기"));
  });
});
