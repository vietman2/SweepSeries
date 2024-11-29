import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import { PostReportType } from "@models/community";
import { getPostReports } from "@services/community";

export function PostReportList() {
  const [reports, setReports] = useState<PostReportType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleDetail = (reportId: number) => {
    navigate(`/community/reports/posts/${reportId}`);
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const response = await getPostReports();

      if (response) {
        setReports(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    if (location.pathname === "/community/reports/posts") {
      fetchReports();
    }
  }, [refreshCount, location]);

  if (loading) return <Loading />;
  if (error) return <ErrorComponent onRefresh={handleRefresh} label="새로고침" />;

  return (
    <List>
      <Header>
        <div>No.</div>
        <div>신고자 아이디</div>
        <div>신고 게시글 제목</div>
        <div>신고 사유</div>
        <div>신고 내용</div>
        <div>처리</div>
      </Header>
      {reports.map((report) => (
        <Row key={report.id} onClick={() => handleDetail(report.id)} data-testid={`report-${report.id}`}>
          <div>{report.id}</div>
          <div>{report.report_user.username}</div>
          <div>{report.post.title}</div>
          <div>{report.reason}</div>
          <div>{report.details}</div>
          <div>{report.status}</div>
        </Row>
      ))}
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
  }

  > div:first-child {
    align-items: center;
    justify-content: center;
    width: 60px;
  }

  > div:last-child {
    border-right: none;
  }
`;

const Header = styled(Row)`
  font-size: 18px;
  font-weight: bold;

  border-top: none;
`;
