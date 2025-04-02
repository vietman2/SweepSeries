import { BaseModal, BaseModalWithDismiss } from "./BaseModal";
import { SimpleModal } from "./SimpleModal";
import { SuccessAlert } from "./SuccessAlert";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Modals");

describe("<BaseModal />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <BaseModal>
        <></>
      </BaseModal>
    );
  });
});

describe("<BaseModalWithDismiss />", () => {
  it("renders with dismiss correctly", () => {
    renderWithProviders(
      <BaseModalWithDismiss onDismiss={() => {}}>
        <></>
      </BaseModalWithDismiss>
    );
  });
});

describe("<SuccessAlert />", () => {
  it("renders correctly", () => {
    renderWithProviders(<SuccessAlert message="Success" />);
  });
});

describe("<SimpleModal />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <SimpleModal
        title="Title"
        buttonText="Button"
        visible={true}
        hideModal={() => {}}
        onButtonPress={() => {}}
      >
        <></>
      </SimpleModal>
    );
  });

  it("renders large modal correctly", () => {
    renderWithProviders(
      <SimpleModal
        title="Title"
        buttonText="Button"
        visible={true}
        hideModal={() => {}}
        onButtonPress={() => {}}
        large
      >
        <></>
      </SimpleModal>
    );
  });
});
