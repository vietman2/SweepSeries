import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  PostReportDetail,
  CommentReportDetail,
  ReCommentReportDetail,
} from "./ReportDetail/ReportDetail";
import {
  PostReportList,
  CommentReportList,
  ReCommentReportList,
} from "./ReportList/ReportList";
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
    const currentLocation = location.pathname.split("/")[3];
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
  return (
    <CommonLayout path="/community/reports/posts">
      <PostReportList />
    </CommonLayout>
  );
}

function CommentReportLayout() {
  return (
    <CommonLayout path="/community/reports/comments">
      <CommentReportList />
    </CommonLayout>
  );
}

function ReCommentReportLayout() {
  return (
    <CommonLayout path="/community/reports/recomments">
      <ReCommentReportList />
    </CommonLayout>
  );
}

interface CommonProps {
  path: string;
  children: React.ReactNode;
}

function CommonLayout({ path, children }: Readonly<CommonProps>) {
  const navigate = useNavigate();
  const location = useLocation();

  const isModalOpen =
    location.pathname.includes(path) && location.pathname !== path;

  const closeModal = () => navigate(path);

  return (
    <>
      {children}
      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <Outlet />
      </SimpleModal>
    </>
  );
}

export {
  CommentReportLayout,
  CommentReportDetail,
  ReCommentReportLayout,
  ReCommentReportDetail,
  PostReportDetail,
  PostReportsLayout,
  ReportsLayout,
};
