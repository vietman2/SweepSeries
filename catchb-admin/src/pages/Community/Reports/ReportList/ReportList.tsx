import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import {
  CommentReportType,
  ReCommentReportType,
  PostReportType,
} from "@models/community";
import {
  getPostReports,
  getCommentReports,
  getReCommentReports,
} from "@services/community";

export function PostReportList() {
  const [reports, setReports] = useState<PostReportType[]>([]);

  const navigate = useNavigate();

  const fetchReports = async () => {
    const response = await getPostReports();

    if (response) {
      setReports(response);
      return true;
    }

    return false;
  };

  const handleDetail = (reportId: number) => {
    navigate(`/community/reports/posts/${reportId}`);
  };

  return (
    <ReportsList
      path="/community/reports/posts"
      target="신고 게시글 제목"
      fetchList={fetchReports}
    >
      {reports.map((report) => (
        <Row
          key={report.id}
          onClick={() => handleDetail(report.id)}
          data-testid={`report-${report.id}`}
        >
          <div>{report.id}</div>
          <div>{report.report_user.username}</div>
          <div>{report.post.title}</div>
          <div>{report.reason}</div>
          <div>{report.details}</div>
          <div>{report.status}</div>
          <div>{report.feedback}</div>
        </Row>
      ))}
    </ReportsList>
  );
}

export function CommentReportList() {
  const [reports, setReports] = useState<CommentReportType[]>([]);

  const navigate = useNavigate();

  const fetchReports = async () => {
    const response = await getCommentReports();

    if (response) {
      setReports(response);
      return true;
    }

    return false;
  };

  const handleDetail = (reportId: number) => {
    navigate(`/community/reports/comments/${reportId}`);
  };

  return (
    <ReportsList
      path="/community/reports/comments"
      target="신고 댓글"
      fetchList={fetchReports}
    >
      {reports.map((report) => (
        <Row
          key={report.id}
          onClick={() => handleDetail(report.id)}
          data-testid={`report-${report.id}`}
        >
          <div>{report.id}</div>
          <div>{report.report_user.username}</div>
          <div>{report.comment.content}</div>
          <div>{report.reason}</div>
          <div>{report.details}</div>
          <div>{report.status}</div>
          <div>{report.feedback}</div>
        </Row>
      ))}
    </ReportsList>
  );
}

export function ReCommentReportList() {
  const [reports, setReports] = useState<ReCommentReportType[]>([]);

  const navigate = useNavigate();

  const fetchReports = async () => {
    const response = await getReCommentReports();

    if (response) {
      setReports(response);
      return true;
    }

    return false;
  };

  const handleDetail = (reportId: number) => {
    navigate(`/community/reports/recomments/${reportId}`);
  };

  return (
    <ReportsList
      path="/community/reports/recomments"
      target="신고 대댓글"
      fetchList={fetchReports}
    >
      {reports.map((report) => (
        <Row
          key={report.id}
          onClick={() => handleDetail(report.id)}
          data-testid={`report-${report.id}`}
        >
          <div>{report.id}</div>
          <div>{report.report_user.username}</div>
          <div>{report.recomment.content}</div>
          <div>{report.reason}</div>
          <div>{report.details}</div>
          <div>{report.status}</div>
          <div>{report.feedback}</div>
        </Row>
      ))}
    </ReportsList>
  );
}

interface Props {
  path: string;
  target: string;
  fetchList: () => Promise<boolean>;
  children: React.ReactNode;
}

function ReportsList({ path, target, fetchList, children }: Readonly<Props>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const location = useLocation();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetchList();

      if (response) {
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    if (location.pathname === path) {
      fetchData();
    }
  }, [refreshCount, location]);

  if (loading) return <Loading />;
  if (error)
    return <ErrorComponent onRefresh={handleRefresh} label="새로고침" />;

  return (
    <List>
      <Header>
        <div>No.</div>
        <div>신고자 아이디</div>
        <div>{target}</div>
        <div>신고 사유</div>
        <div>신고 내용</div>
        <div>처리</div>
        <div>처리 답변</div>
      </Header>
      {children}
    </List>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;

  font-size: 16px;

  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};

  > div {
    display: flex;
    padding: 8px 12px;
    width: 180px;

    border-right: 1px solid ${({ theme }) => theme.colors.borderLight};

    white-space: nowrap;
    overflow: hidden;
  }

  > div:first-child {
    align-items: center;
    justify-content: center;
    width: 60px;
  }

  > div:last-child {
    flex: 1;
    border-right: none;
  }
`;

const Header = styled(Row)`
  font-size: 18px;
  font-weight: bold;

  border-top: none;
`;
