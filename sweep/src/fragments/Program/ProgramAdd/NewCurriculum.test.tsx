import { fireEvent } from "@testing-library/react-native";

import { EditCurriculum, NewCurriculum } from "./NewCurriculum";
import { sampleCurriculums } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<NewCurriculum />", () => {
  it("should render single row", () => {
    const { getByTestId } = renderWithProviders(
      <NewCurriculum rows={[sampleCurriculums[0]]} setRows={jest.fn()} />
    );

    fireEvent.press(getByTestId("plus"));
    fireEvent.changeText(getByTestId("수업 수"), "10");
    fireEvent.changeText(getByTestId("가격"), "10000");
    fireEvent.press(getByTestId("delete-button0"));
  });

  it("should render multiple rows", () => {
    const { getByTestId, getAllByTestId } = renderWithProviders(
      <NewCurriculum rows={sampleCurriculums} setRows={jest.fn()} />
    );

    fireEvent.changeText(getAllByTestId("수업 수")[0], "");
    fireEvent.press(getByTestId("delete-button0"));
  });
});

describe("<EditCurriculum />", () => {
  it("should render", () => {
    renderWithProviders(
      <EditCurriculum curriculums={[sampleCurriculums[0]]} />
    );
  });
});
