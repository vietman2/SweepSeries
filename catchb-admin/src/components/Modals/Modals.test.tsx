import { SimpleModal } from "./SimpleModal";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Modals");

describe("<SimpleModal />", () => {
  it("renders children when isOpen is true", () => {
    renderWithProviders(
      <SimpleModal isOpen onClose={jest.fn()}>
        <div>Test</div>
      </SimpleModal>
    );
  });

  it("does not render children when isOpen is false", () => {
    renderWithProviders(
      <SimpleModal isOpen={false} onClose={jest.fn()}>
        <div>Test</div>
      </SimpleModal>
    );
  });
});
