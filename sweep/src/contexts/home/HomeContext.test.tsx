import { TouchableOpacity, View } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { HomeProvider, useHome } from "./HomeContext";
import { sampleAcademies } from "@testdata/products";

jest.unmock("@contexts/home");

const TestComponent = () => {
  const { selectAcademy } = useHome();

  return (
    <View>
      <TouchableOpacity
        testID="selectAcademy"
        onPress={() => selectAcademy(sampleAcademies[0])}
      />
    </View>
  );
};

describe("HomeProvider", () => {
  it("selects academy correctly", async () => {
    const { getByTestId } = render(
      <HomeProvider>
        <TestComponent />
      </HomeProvider>
    );

    fireEvent.press(getByTestId("selectAcademy"));
  });

  it("handles context errors", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });
});
