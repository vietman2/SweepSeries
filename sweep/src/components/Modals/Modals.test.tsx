import { render } from "@testing-library/react-native";

import { SimpleModal } from "./SimpleModal";

jest.unmock("@components/Modals");

describe("<SimpleModal />", () => {
  it("renders correctly", () => {
    render(
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
    render(
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
