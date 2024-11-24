import { fireEvent, screen } from "@testing-library/react";

import { HeaderTabs } from "./HeaderTabs";
import { Home } from "@navigation/tabs";
import { renderWithProviders } from "@utils/test-utils";

jest.unmock("@components/Tabs");

describe("<HeaderTabs />", () => {
  it("should render", () => {
    renderWithProviders(
      <HeaderTabs
        title={Home.title}
        tabs={Home.subtabs}
        activeTab="대시보드"
        setActiveTab={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("대시보드"));
  });
});
