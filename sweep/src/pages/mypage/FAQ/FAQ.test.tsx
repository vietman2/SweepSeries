import { fireEvent } from "@testing-library/react-native";

import { FAQ } from "./FAQ";
import { sampleFAQs } from "@testdata/customers";
import { renderWithProviders } from "@utils/test-utils";

describe("<FAQ />", () => {
  it("renders and toggles faqs", () => {
    const { getByText } = renderWithProviders(<FAQ />);

    fireEvent.press(getByText(sampleFAQs[0].question));
    fireEvent.press(getByText(sampleFAQs[0].question));
  });
});
