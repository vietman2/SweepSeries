import { fireEvent, screen, waitFor } from "@testing-library/react";

import { AcademyList } from "./AcademyList";
import { sampleAcademies } from "@data/products";
import * as AcademiesAPI from "@services/products/academies";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Academy", () => ({
  AcademySimpleHeader: () => <div>AcademySimpleHeader</div>,
  AcademySimple: () => <div>AcademySimple</div>,
}));

describe("<AcademyList />", () => {
  beforeEach(() => {
    jest.spyOn(AcademiesAPI, "getAcademies").mockResolvedValue(sampleAcademies);
  });

  it("handles bad response", async () => {
    jest.spyOn(AcademiesAPI, "getAcademies").mockResolvedValue(null);
    renderWithProviders(<AcademyList />);

    await waitFor(() => fireEvent.click(screen.getByText("새로고침")));
  });

  it("renders without crashing", async () => {
    renderWithProviders(<AcademyList />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("승인 완료"));
      fireEvent.click(screen.getByText("승인 대기"));
      fireEvent.click(screen.getByText("승인 거부"));
    });
  });
});
