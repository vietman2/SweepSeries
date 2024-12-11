import { fireEvent, waitFor } from "@testing-library/react-native";

import { UpdateModal } from "./UpdateModal";
import * as AcademiesAPI from "@services/products/academy";
import { sampleAcademyDetail } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<UpdateModal />", () => {
  it("should handle all buttons correctly", async () => {
    jest.spyOn(AcademiesAPI, "updateBusinessHours").mockResolvedValue({});
    const { getByTestId } = renderWithProviders(
      <UpdateModal
        schedule={sampleAcademyDetail.schedules}
        initialSchedule={sampleAcademyDetail.schedule_details}
        modalVisible
        hideModal={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.changeText(getByTestId("openTime"), "09:00");
      fireEvent.changeText(getByTestId("closeTime"), "18:00");
      fireEvent.press(getByTestId("toggleClosed"));
      fireEvent.press(getByTestId("toggleAllday"));
      fireEvent.press(getByTestId("everyday"));
      fireEvent.press(getByTestId("weekdays"));
      fireEvent.press(getByTestId("weekends"));
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("should update without refresh", async () => {
    jest.spyOn(AcademiesAPI, "updateBusinessHours").mockResolvedValue({});
    const { getByTestId } = renderWithProviders(
      <UpdateModal
        schedule={sampleAcademyDetail.schedules}
        initialSchedule={sampleAcademyDetail.schedule_details}
        modalVisible
        hideModal={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("저장"));
    });
  });

  it("should load weekday and weekend and handle update failure", async () => {
    const data = [
      {
        day: "평일",
        schedule: "",
      },
      {
        day: "주말",
        schedule: "",
      },
    ];
    jest.spyOn(AcademiesAPI, "updateBusinessHours").mockResolvedValue(null);
    const { getByTestId } = renderWithProviders(
      <UpdateModal
        schedule={data}
        initialSchedule={sampleAcademyDetail.schedule_details}
        modalVisible
        hideModal={jest.fn()}
        onRefresh={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("저장"));
    });
  });
});
