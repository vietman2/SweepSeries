import { fireEvent, screen, waitFor } from "@testing-library/react";

import { CoachSimple, CoachSimpleHeader } from "./CoachSimple";
import { sampleCoaches } from "@data/products";
import * as CoachesAPI from "@services/products/coaches";
import { renderWithProviders } from "@utils/test-utils";

describe("<CoachSimpleHeader />", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <>
        <CoachSimpleHeader type="승인 완료" />
        <CoachSimpleHeader type="승인 거부" />
        <CoachSimpleHeader type="승인 대기" />
      </>
    );
  });
});

describe("<CoachSimple />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        reload: jest.fn(),
      },
      writable: true,
    });
  });

  it("renders correctly", () => {
    renderWithProviders(
      <>
        <CoachSimple coach={sampleCoaches[0]} type="승인 완료" />
        <CoachSimple coach={sampleCoaches[0]} type="승인 거부" />
        <CoachSimple coach={sampleCoaches[0]} type="승인 대기" />
      </>
    );
  });

  it("handles approve and reject fail", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    jest.spyOn(CoachesAPI, "approveCoach").mockResolvedValue(null);
    jest.spyOn(CoachesAPI, "rejectCoach").mockResolvedValue(null);
    renderWithProviders(
      <CoachSimple coach={sampleCoaches[0]} type="승인 대기" />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("승인"));
      fireEvent.click(screen.getByText("거절"));
      fireEvent.click(screen.getByText("취소"));
      fireEvent.click(screen.getByText("거절"));
      fireEvent.click(screen.getByText("확인"));
    });
  });

  it("handles approve correctly", async () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(false);
    jest.spyOn(window, "confirm").mockReturnValueOnce(true);
    jest.spyOn(CoachesAPI, "approveCoach").mockResolvedValue(true);
    renderWithProviders(
      <CoachSimple coach={sampleCoaches[0]} type="승인 대기" />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("승인"));
      fireEvent.click(screen.getByText("승인"));
    });
  });

  it("handles reject correctly", async () => {
    jest.spyOn(CoachesAPI, "rejectCoach").mockResolvedValue(true);
    renderWithProviders(
      <CoachSimple coach={sampleCoaches[0]} type="승인 대기" />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("거절"));
      fireEvent.change(screen.getByTestId("reject-reason"), {
        target: { value: "reason" },
      });
      fireEvent.click(screen.getByText("확인"));
    });
  });
});
