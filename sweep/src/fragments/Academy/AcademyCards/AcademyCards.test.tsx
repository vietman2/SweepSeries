import { fireEvent, waitFor } from "@testing-library/react-native";

import { AcademyCards } from "./AcademyCards";
import * as AuthContext from "@contexts/auth";
// import * as HomeContext from "@contexts/home";
import * as AcademiesAPI from "@services/products/academy";
import { renderWithProviders } from "@utils/test-utils";
import { sampleAcademies } from "@testdata/products";

jest.mock("./Cards", () => {
  const { Text, TouchableOpacity } = jest.requireActual("react-native");

  return {
    EmptyCard: () => <Text>EmptyCard</Text>,
    NormalCard: ({ onPress }: { onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="normal-card" />
    ),
    ProCard: ({ onPress }: { onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID="pro-card" />
    ),
  };
});

describe("<AcademyCards />", () => {
  const defaultAuthContext = {
    selectedProfile: null,
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(() => {
    jest
      .spyOn(AuthContext, "useAuth")
      .mockReturnValue({ ...defaultAuthContext, mode: "normal" });
    jest
      .spyOn(AcademiesAPI, "getMyAcademies")
      .mockResolvedValue(sampleAcademies);
  });

  it("should render nothing in guest mode", () => {
    jest
      .spyOn(AuthContext, "useAuth")
      .mockReturnValue({ ...defaultAuthContext, mode: "guest" });

    renderWithProviders(<AcademyCards />);
  });

  it("should render normal mode with no academies", async () => {
    jest.spyOn(AcademiesAPI, "getMyAcademies").mockResolvedValue(null);

    const { getByText } = renderWithProviders(<AcademyCards />);

    await waitFor(() => expect(getByText("EmptyCard")).toBeTruthy());
  });

  it("should render normal mode with academies", async () => {
    const { getAllByTestId } = renderWithProviders(<AcademyCards />);

    await waitFor(() => fireEvent.press(getAllByTestId("normal-card")[0]));
  });

  it("should render pro mode with academies and handle scroll", async () => {
    jest
      .spyOn(AuthContext, "useAuth")
      .mockReturnValue({ ...defaultAuthContext, mode: "pro" });

    const { getAllByTestId, getByTestId } = renderWithProviders(
      <AcademyCards />
    );

    await waitFor(() => {
      fireEvent.press(getAllByTestId("pro-card")[0]);
      fireEvent.scroll(getByTestId("scroll"), {
        nativeEvent: {
          contentOffset: { x: 100, y: 0 },
          contentSize: { width: 1000, height: 100 },
          layoutMeasurement: { width: 100, height: 100 },
        },
      });
    });
  });
});
