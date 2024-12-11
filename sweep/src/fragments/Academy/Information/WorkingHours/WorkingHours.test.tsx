import { fireEvent } from "@testing-library/react-native";

import { WorkingHours } from "./WorkingHours";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("./UpdateModal", () => {
  const { TouchableOpacity } = jest.requireActual("react-native");
  return {
    UpdateModal: ({
      hideModal,
      onRefresh,
    }: {
      hideModal: () => void;
      onRefresh: () => void;
    }) => (
      <>
        <TouchableOpacity onPress={hideModal} testID="hide" />
        <TouchableOpacity onPress={onRefresh} testID="저장" />
      </>
    ),
  };
});

describe("<WorkingHours />", () => {
  it("handles update successfully", () => {
    const { getByTestId } = renderWithProviders(
      <WorkingHours
        workingHours={sampleAcademyDetail.schedules}
        scheduleDetails={sampleAcademyDetail.schedule_details}
        edit
        onRefresh={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("hide"));
    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("저장"));
  });

  it("handles update with no refresh", () => {
    const { getByTestId } = renderWithProviders(
      <WorkingHours
        workingHours={sampleAcademyDetail.schedules}
        scheduleDetails={sampleAcademyDetail.schedule_details}
        edit
      />
    );

    fireEvent.press(getByTestId("open"));
    fireEvent.press(getByTestId("저장"));
  });

  it("handles normal view", () => {
    renderWithProviders(
      <WorkingHours
        workingHours={sampleAcademyDetail.schedules}
        scheduleDetails={sampleAcademyDetail.schedule_details}
      />
    );
  });
});
