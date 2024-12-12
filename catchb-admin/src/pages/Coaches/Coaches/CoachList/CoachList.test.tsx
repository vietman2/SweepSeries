import { fireEvent, screen, waitFor } from "@testing-library/react";

import { CoachList } from "./CoachList";
import { sampleCoaches } from "@data/products";
import * as CoachesAPI from "@services/products/coaches";
import { renderWithProviders } from "@utils/test-utils";

jest.mock("@fragments/Coach", () => ({
  CoachSimple: () => <div>CoachSimple</div>,
  CoachSimpleHeader: () => <div>CoachSimpleHeader</div>,
}));

describe("<CoachList />", () => {
  it("should render without crashing", async () => {
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(sampleCoaches);
    renderWithProviders(<CoachList />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("승인 거부"));
      fireEvent.click(screen.getByText("승인 대기"));
      fireEvent.click(screen.getByText("승인 완료"));
    });

    await waitFor(() => {
      expect(screen.getByText("CoachSimple")).toBeInTheDocument();
    });
  });

  it("handles error correctly", async () => {
    jest.spyOn(CoachesAPI, "getCoaches").mockResolvedValue(null);
    renderWithProviders(<CoachList />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("새로고침"));
    });
  });
});
