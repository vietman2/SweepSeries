import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { MainLogo } from "@components/Icons";
import { useAuth } from "@contexts/auth";
import { TabType, tabs } from "@navigation/tabs";

export function RootLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Container>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
}

function Sidebar() {
  const [selectedPathName, setSelectedPathName] = useState<string>("");

  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // first level
    const path = location.pathname.split("/")[1];

    setSelectedPathName(path);
  }, [location]);

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <MainLogo size={160} />
      </SidebarHeader>
      <SidebarContent>
        {tabs.map((tab: TabType) => (
          <SidebarTab
            key={tab.path}
            selected={selectedPathName === tab.pathName}
            onClick={() => handleTabClick(tab.path)}
          >
            {tab.title}
          </SidebarTab>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavTab onClick={handleLogout}>로그아웃</NavTab>
      </SidebarFooter>
    </SidebarContainer>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background300};
  width: 100%;
  height: 100dvh;
  overflow-x: auto;
  user-select: none;
`;

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 260px;
  transition: width 0.3s ease-in-out;
  overflow-x: hidden;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 260px;
  background-color: #262626;
  color: white;
  padding: 24px;
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 0 20px 20px 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  gap: 4px;
`;

const SidebarContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 8px 0;
  gap: 8px;
`;

const NavTab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 4px;

  font-size: 16px;
  font-weight: bold;

  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f44336;
  }
`;

const SidebarTab = styled(NavTab)<{ selected: boolean }>`
  justify-content: flex-start;
  padding: ${({ selected }) => (selected ? "12px 16px" : "12px 4px")};

  color: ${({ theme }) => theme.colors.background500};

  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.foreground500 : "transparent"};

  transition: background-color 0.3s ease-in-out;

  &:hover {
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.colors.foreground500};

    transition: padding 0.2s ease-in-out;
  }
`;

const SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0;

  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
