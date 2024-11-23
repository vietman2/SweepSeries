import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { HeaderTabs } from "@components/Tabs";
import { SubTabType, TabType } from "@navigation/tabs";

interface Props {
  selectedTab: TabType;
}

export function ContentLayout({ selectedTab }: Readonly<Props>) {
  const [selectedSubtab, setSelectedSubtab] = useState<string>(
    selectedTab.subtabs[0].title
  );

  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (tab: SubTabType) => {
    navigate(tab.path);
  };

  useEffect(() => {
    const subtab = selectedTab.subtabs.find(
      (subtab) => subtab.path === location.pathname
    );

    if (subtab) {
      setSelectedSubtab(subtab.title);
    }
  }, [location, selectedTab]);

  return (
    <Container>
      <HeaderTabs
        title={selectedTab.title}
        tabs={selectedTab.subtabs}
        activeTab={selectedSubtab}
        setActiveTab={handleTabChange}
      />
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.background500};
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  margin: 8px;
`;
