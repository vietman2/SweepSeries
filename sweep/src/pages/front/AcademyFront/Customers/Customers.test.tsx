import { fireEvent, waitFor } from "@testing-library/react-native";

import { CustomerManagement } from "./Customers";
import * as StudentsAPI from "@services/products/students";
import { sampleStudents } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.mock("@fragments/Profile", () => ({
  ProfileImage: () => <div />,
}));

describe("<CustomerManagement />", () => {
  it("renders correctly", async () => {
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(sampleStudents);

    const { getByTestId } = renderWithProviders(<CustomerManagement />);

    await waitFor(() => {
      fireEvent.press(getByTestId("refresh"));
      fireEvent.press(getByTestId("student-1"));
    });
  });

  it("handles api error correctly", async () => {
    jest.spyOn(StudentsAPI, "getStudents").mockResolvedValue(null);

    waitFor(() => renderWithProviders(<CustomerManagement />));
  });
});
