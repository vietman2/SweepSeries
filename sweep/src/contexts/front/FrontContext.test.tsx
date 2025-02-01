import { TouchableOpacity, View } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { FrontProvider, useFront } from "./FrontContext";
import * as AcademiesAPI from "@services/products/academy";
import * as CoachesAPI from "@services/products/coach";
import { sampleAcademies, sampleCoaches } from "@testdata/products";

jest.unmock("@contexts/front");

const TestComponent = () => {
  const { selectAcademy, selectCoach } = useFront();

  return (
    <View>
      <TouchableOpacity
        testID="selectAcademy"
        onPress={() => selectAcademy(sampleAcademies[0])}
      />
      <TouchableOpacity
        testID="selectCoach"
        onPress={() => selectCoach(sampleCoaches[0])}
      />
    </View>
  );
};

describe("FrontProvider", () => {
  it("selects academy and coach correctly", async () => {
    jest
      .spyOn(AcademiesAPI, "getMyAcademies")
      .mockResolvedValue(sampleAcademies);
    jest
      .spyOn(CoachesAPI, "getMyCoachProfile")
      .mockResolvedValue(sampleCoaches[0]);

    const { getByTestId } = render(
      <FrontProvider>
        <TestComponent />
      </FrontProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("selectAcademy"));
      fireEvent.press(getByTestId("selectCoach"));
    });
  });

  it("handles api errors", async () => {
    jest.spyOn(AcademiesAPI, "getMyAcademies").mockResolvedValue(null);
    jest.spyOn(CoachesAPI, "getMyCoachProfile").mockResolvedValue(null);

    render(
      <FrontProvider>
        <TestComponent />
      </FrontProvider>
    );
  });

  it("handles context misuse", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow();
  });
});
