import { fireEvent, screen } from "@testing-library/react";

import { ContentInput } from "./ContentInput";
import { TextInput } from "./TextInput";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("react-quill", () => {
  const { forwardRef } = jest.requireActual("react");

  const Component = forwardRef(({}, ref: React.RefObject<HTMLDivElement>) => {
    return <div ref={ref} data-testid="quill" />;
  });

  return {
    __esModule: true,
    default: Component,
  };
});
jest.mock("react-quill/dist/quill.snow.css", () => {
  return {};
});
jest.unmock("@components/Inputs");

describe("<ContentInput />", () => {
  it("renders a content input element", () => {
    renderWithProviders(<ContentInput content="" setContent={jest.fn()} />);
  });
});

describe("<TextInput />", () => {
  it("renders an input element", () => {
    renderWithProviders(
      <TextInput placeholder="Username" value="" onChange={() => {}} />
    );

    fireEvent.change(screen.getByTestId("text-input"), {
      target: { value: "test" },
    });
  });

  it("renders an password input element", () => {
    renderWithProviders(
      <TextInput placeholder="Username" value="" onChange={() => {}} password />
    );

    fireEvent.change(screen.getByTestId("text-input"), {
      target: { value: "test" },
    });
  });
});
