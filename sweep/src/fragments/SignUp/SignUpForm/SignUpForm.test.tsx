import { SignUpForm } from "./SignUpForm";
import { renderWithProviders } from "@utils/test-utils";

describe("<SignUpForm />", () => {
  const commonProps = {
    title: "title",
    subtitle: "subtitle",
    buttonText: "button",
    buttonOnPress: jest.fn(),
    buttonDisabled: false,
    loading: false,
    error: false,
  };

  it("should render", () => {
    renderWithProviders(
      <SignUpForm {...commonProps}>
        <></>
      </SignUpForm>
    );
  });

  it("should render loading", () => {
    renderWithProviders(
      <SignUpForm {...commonProps} loading>
        <></>
      </SignUpForm>
    );
  });

  it("should render error", () => {
    renderWithProviders(
      <SignUpForm {...commonProps} error>
        <></>
      </SignUpForm>
    );
  });
});
