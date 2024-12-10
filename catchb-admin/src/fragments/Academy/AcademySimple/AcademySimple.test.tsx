import { fireEvent, screen, waitFor } from "@testing-library/react";

import { AcademySimple, AcademySimpleHeader } from "./AcademySimple";
import { sampleAcademies } from "@data/products";
import * as AcademiesAPI from "@services/products/academies";
import { renderWithProviders } from "@utils/test-utils";

describe("<AcademySimpleHeader />", () => {
  it("should render without errors", () => {
    renderWithProviders(
      <>
        <AcademySimpleHeader type="승인 완료" />
        <AcademySimpleHeader type="승인 거부" />
        <AcademySimpleHeader type="승인 대기" />
      </>
    );
  });
});

describe("<AcademySimple />", () => {
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

  it("should render without errors", () => {
    renderWithProviders(
      <>
        <AcademySimple academy={sampleAcademies[0]} type="승인 완료" />
        <AcademySimple academy={sampleAcademies[0]} type="승인 거부" />
      </>
    );
  });

  it("handles approve", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    jest.spyOn(AcademiesAPI, "approveAcademy").mockResolvedValue(true);

    renderWithProviders(
      <AcademySimple academy={sampleAcademies[0]} type="승인 대기" />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("승인"));
    });
  });

  it("handles approve fail", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    jest.spyOn(AcademiesAPI, "approveAcademy").mockResolvedValue(null);

    renderWithProviders(
      <AcademySimple academy={sampleAcademies[0]} type="승인 대기" />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("승인"));
    });
  });

  it("handles approve cancel", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);

    renderWithProviders(
      <AcademySimple academy={sampleAcademies[0]} type="승인 대기" />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("승인"));
    });
  });

  it("handles reject", async () => {
    jest.spyOn(AcademiesAPI, "rejectAcademy").mockResolvedValue(true);
    renderWithProviders(
      <AcademySimple academy={sampleAcademies[0]} type="승인 대기" />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("거절"));
      fireEvent.change(screen.getByTestId("reject-reason"), {
        target: { value: "reason" },
      });
      fireEvent.click(screen.getByText("확인"));
    });
  });

  it("handles reject fail", async () => {
    jest.spyOn(AcademiesAPI, "rejectAcademy").mockResolvedValue(null);
    renderWithProviders(
      <AcademySimple academy={sampleAcademies[0]} type="승인 대기" />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("확인"));
    });
  });

  it("handles reject cancel", async () => {
    jest.spyOn(AcademiesAPI, "rejectAcademy").mockResolvedValue(null);
    renderWithProviders(
      <AcademySimple academy={sampleAcademies[0]} type="승인 대기" />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("취소"));
    });
  });
});
