import { Text } from "react-native";
import { render, waitFor } from "@testing-library/react-native";

import {
  AcademyDetailProvider,
  useAcademyDetail,
} from "./AcademyDetailContext";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademyDetail } from "@testdata/products";

const TestComponent = () => {
  const { academy } = useAcademyDetail();

  return <Text>{academy?.name}</Text>;
};

describe("<AcademyDetailContext />", () => {
  it("should fetch academy detail", async () => {
    jest
      .spyOn(AcademiesAPI, "getAcademyDetail")
      .mockResolvedValue(sampleAcademyDetail);

    const { getByText } = render(
      <AcademyDetailProvider>
        <TestComponent />
      </AcademyDetailProvider>
    );

    await waitFor(() => {
      expect(getByText(sampleAcademyDetail.name)).toBeTruthy();
    });
  });

  it("should handle api error", async () => {
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
