import { Text, TouchableOpacity, View } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as Router from "expo-router";

import {
  AcademyDetailProvider,
  useAcademyDetail,
} from "./AcademyDetailContext";
import * as AcademiesAPI from "@services/products/academy";
import {
  sampleAcademyDetail,
  sampleCoaches,
  sampleNotices,
} from "@testdata/products";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

const TestComponent = () => {
  const { academy, selectCoach, selectNotice } = useAcademyDetail();

  return (
    <View>
      <Text>{academy?.name}</Text>
      <TouchableOpacity
        onPress={() => selectCoach(sampleCoaches[0])}
        testID="coach"
      />
      <TouchableOpacity
        onPress={() => selectNotice("1", sampleNotices[0])}
        testID="notice"
      />
    </View>
  );
};

describe("<AcademyDetailContext />", () => {
  beforeEach(() => {
    jest.spyOn(Router, "useLocalSearchParams").mockReturnValue({ id: "1" });
    jest.spyOn(Router, "usePathname").mockReturnValue("/home/academy/1");
  });

  it("should fetch academy detail and coach/notice select", async () => {
    jest
      .spyOn(AcademiesAPI, "getAcademyDetail")
      .mockResolvedValue(sampleAcademyDetail);

    const { getByText, getByTestId } = render(
      <AcademyDetailProvider>
        <TestComponent />
      </AcademyDetailProvider>
    );

    await waitFor(() => {
      expect(getByText(sampleAcademyDetail.name)).toBeTruthy();
    });

    fireEvent.press(getByTestId("coach"));
    fireEvent.press(getByTestId("notice"));
  });

  it("should handle api error", async () => {
    jest
      .spyOn(Router, "usePathname")
      .mockReturnValue("/home/academy/1/coaches/1");
    jest.spyOn(AcademiesAPI, "getAcademyDetail").mockResolvedValue(null);

    render(
      <AcademyDetailProvider>
        <TestComponent />
      </AcademyDetailProvider>
    );
  });

  it("should throw an error when used outside of AcademyDetailProvider", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });
});
