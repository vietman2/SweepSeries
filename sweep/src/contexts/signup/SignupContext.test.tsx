import { Text, TouchableOpacity, View } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { SignupProvider, useSignup } from "./SignupContext";
import * as AgreementsAPI from "@services/auth/agreements";
import { sampleAgreements } from "@testdata/auth";

jest.unmock("@contexts/signup");

const TestComponent = () => {
  const { terms, setCheck, checkAll } = useSignup();

  return (
    <View>
      {terms.map((agreement) => (
        <Text key={agreement.id}>{agreement.title}</Text>
      ))}
      <TouchableOpacity onPress={checkAll} testID="checkAll" />
      <TouchableOpacity onPress={() => setCheck(1)} testID="setCheck" />
    </View>
  );
};

describe("<SignupProvider />", () => {
  it("renders and updates checked terms correctly", async () => {
    jest
      .spyOn(AgreementsAPI, "getAgreements")
      .mockResolvedValue(sampleAgreements);

    const { getByTestId, getByText } = render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>
    );

    await waitFor(() => {
      expect(getByText("약관 1")).toBeDefined();
    });

    fireEvent.press(getByTestId("checkAll")); // 전체 선택
    fireEvent.press(getByTestId("checkAll")); // 전체 해제
    fireEvent.press(getByTestId("setCheck")); // 1번 선택
  });

  it("handles agreements fetch error", async () => {
    jest.spyOn(AgreementsAPI, "getAgreements").mockResolvedValue(null);

    render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>
    );
  });

  it("handles misuse", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });
});
