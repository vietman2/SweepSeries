import { fireEvent } from "@testing-library/react-native";

import { NormalCard, ProCard } from "./AcademyCard";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("<NormalCard />", () => {
  it("renders type 1 correctly", () => {
    const { getByTestId } = renderWithProviders(<NormalCard />);

    fireEvent.press(getByTestId("myacademy"));
  });

  it("renders type 2 correctly", () => {
    renderWithProviders(<NormalCard type={2} />);
  });
});

describe("<ProCard />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <ProCard num_requests={0} num_students={0} />
        <ProCard num_requests={1} num_students={1} />
      </>
    );
  });
});
