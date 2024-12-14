//import { NavigationContainer } from "@react-navigation/native";

import { AcademyFront } from "./AcademyFront";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademyDetail } from "@testdata/products";
import { fireEvent, waitFor } from "@testing-library/react-native";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@react-navigation/material-top-tabs", () => {
  const { View } = jest.requireActual("react-native");
  const actual = jest.requireActual("@react-navigation/material-top-tabs");
  return {
    ...actual,
    createMaterialTopTabNavigator: jest.fn(() => ({
      Navigator: jest.fn(
        ({
          tabBar,
          children,
        }: {
          tabBar: () => React.ReactNode;
          children: React.ReactNode;
        }) => (
          <View>
            {tabBar()}
            {children}
          </View>
        )
      ),
      Screen: ({ component }: { component: () => React.ReactNode }) =>
        component(),
    })),
  };
});
jest.mock("./Profile/Profile", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");
  return {
    ProfileManagement: ({ onRefresh }: { onRefresh: () => void }) => (
      <TouchableOpacity onPress={onRefresh} testID="profile-management" />
    ),
  };
});
jest.mock("./Programs/Programs", () => ({
  ProgramManagement: () => <div data-testid="program-management" />,
}));
jest.mock("./Customers/Customers", () => ({
  CustomerManagement: () => <div data-testid="customer-management" />,
}));
jest.mock("./Reviews/Reviews", () => ({
  ReviewManagement: () => <div data-testid="review-management" />,
}));
jest.mock("./Employees/Employees", () => ({
  EmployeeManagement: () => <div data-testid="employee-management" />,
}));
jest.mock("./Notices/Notices", () => ({
  NoticeManagement: () => <div data-testid="notice-management" />,
}));

describe("<AcademyFront />", () => {
  it("handles bad response", async () => {
    jest.spyOn(AcademiesAPI, "getAcademyDetail").mockResolvedValue(null);
    renderWithProviders(<AcademyFront uuid="uuid" />);
  });

  it("renders correctly", async () => {
    jest
      .spyOn(AcademiesAPI, "getAcademyDetail")
      .mockResolvedValue(sampleAcademyDetail);
    const { getByTestId } = renderWithProviders(<AcademyFront uuid="uuid" />);

    await waitFor(() => fireEvent.press(getByTestId("profile-management")));
  });
});
