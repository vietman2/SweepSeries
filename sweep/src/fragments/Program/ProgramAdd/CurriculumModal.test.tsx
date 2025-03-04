import { fireEvent } from "@testing-library/react-native";

import { CurriculumModal } from "./CurriculumModal";
import { sampleCurriculums } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./NewCurriculum", () => ({
  NewCurriculum: () => null,
}));

describe("<CurriculumModal />", () => {
  it("renders without crashing", () => {
    const { getByTestId } = renderWithProviders(
      <CurriculumModal
        curriculums={sampleCurriculums}
        closeModal={jest.fn()}
        submit={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("저장"));
  });
});
