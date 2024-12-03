import { fireEvent, waitFor } from "@testing-library/react-native";

import { FAQ } from "./FAQ";
import * as FAQsAPI from "@services/app/faqs";
import { sampleFAQs } from "@testdata/customers";
import { renderWithProviders } from "@utils/test-utils";

describe("<FAQ />", () => {
  it("renders and toggles faqs", async () => {
    jest.spyOn(FAQsAPI, "getFAQs").mockResolvedValue(sampleFAQs);
    const { getByText } = renderWithProviders(<FAQ />);

    await waitFor(() => {
      fireEvent.press(getByText(sampleFAQs[0].question));
      fireEvent.press(getByText(sampleFAQs[0].question));
    });
  });

  it("handles error", async () => {
    jest.spyOn(FAQsAPI, "getFAQs").mockResolvedValue(null);
    waitFor(() => renderWithProviders(<FAQ />));
  });
});
