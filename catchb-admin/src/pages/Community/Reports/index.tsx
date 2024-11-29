import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { PostReportDetail } from "./PostReport/PostReportDetail/PostReportDetail";
import { PostReportList } from "./PostReport/PostReportList/PostReportList";
import { SimpleModal } from "@components/Modals";

function ReportsLayout() {
  type TabType = {
    path: string;
    label: string;
  };

  const options: TabType[] = [
    {
      path: "posts",
      label: "게시글",
    },
    {
      path: "comments",
      label: "댓글",
    },
    {
      path: "recomments",
      label: "대댓글",
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (tab: TabType) => {
    navigate(tab.path);
  };

  const isSelected = (tab: TabType) => {
    const currentLocation = location.pathname.split("/").pop();
    return currentLocation === tab.path;
  };

  return (
    <Container>
      <Tabs>
        {options.map((option) => (
          <Tab
            key={option.path}
            onClick={() => handleClick(option)}
            $selected={isSelected(option)}
          >
            {option.label}
          </Tab>
        ))}
      </Tabs>
      <Outlet />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
`;

const Tab = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 4px;

  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.foreground900 : theme.colors.foreground500};
  font-size: 18px;
  font-weight: 500;

  border-bottom: ${({ $selected, theme }) =>
    $selected ? `2px solid ${theme.colors.foreground900}` : "none"};
`;

function PostReportsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isModalOpen =
    location.pathname.includes("/community/reports/posts/") &&
    location.pathname !== "/community/reports/posts";

  const closeModal = () => navigate("/community/reports/posts");

  return (
    <>
      <PostReportList />
      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <Outlet />
      </SimpleModal>
    </>
  );
}

export { PostReportDetail, PostReportsLayout, ReportsLayout };
