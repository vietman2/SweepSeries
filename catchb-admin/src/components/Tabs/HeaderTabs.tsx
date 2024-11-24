import styled from "styled-components";

import { VerticalDivider } from "@components/Dividers";
import { SubTabType } from "@navigation/tabs";

interface Props {
  title: string;
  tabs: SubTabType[];
  activeTab: string;
  setActiveTab: (tab: SubTabType) => void;
}

export function HeaderTabs({
  title,
  tabs,
  activeTab,
  setActiveTab,
}: Readonly<Props>) {
  return (
    <Header>
      <Title>{title}</Title>
      <VerticalDivider height="45%" bold />
      <Tabs>
        {tabs.map((tab) => (
          <Tab
            key={tab.title}
            $active={activeTab === tab.title}
            onClick={() => setActiveTab(tab)}
          >
            {tab.title}
          </Tab>
        ))}
      </Tabs>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  gap: 16px;

  position: sticky;
  top: 0;
  z-index: 10;

  background-color: ${({ theme }) => theme.colors.background700};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const Tabs = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px;
`;

const Tab = styled.div<{ $active: boolean }>`
  padding: 8px 16px;

  font-size: 18px;
  font-weight: ${({ $active }) => ($active ? "700" : "400")};

  cursor: pointer;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.foreground900};

  transition: background-color 0.3s ease-in-out;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 0 32px;
  color: ${({ theme }) => theme.colors.primary};
`;
