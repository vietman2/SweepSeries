import { fireEvent } from "@testing-library/react-native";

import { WorkingHours } from "./WorkingHours";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<WorkingHours />", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProviders(
      <WorkingHours workingHours={sampleAcademyDetail.working_hours} />
    );

    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("hide"));
    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("저장"));
  });
});
