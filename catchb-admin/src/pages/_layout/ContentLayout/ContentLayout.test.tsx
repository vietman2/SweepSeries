import { fireEvent, screen } from "@testing-library/react";

import { ContentLayout } from "./ContentLayout";
import { Home } from "@navigation/tabs";
import { renderWithProviders } from "@utils/test-utils";

describe("<ContentLayout />", () => {
  it("renders children", () => {
    renderWithProviders(<ContentLayout selectedTab={Home} />);

    fireEvent.click(screen.getByText("대시보드"));
  });
});
