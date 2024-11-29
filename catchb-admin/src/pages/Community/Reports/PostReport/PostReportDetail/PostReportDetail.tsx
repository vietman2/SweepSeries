import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { Divider } from "@components/Dividers";
import { ErrorComponent, Loading } from "@components/Fallbacks";
import { TextInput } from "@components/Inputs";
import { PostReportType } from "@models/community";
import { getPostReportDetails, updatePostReport } from "@services/community";

export function PostReportDetail() {
  const [report, setReport] = useState<PostReportType>();
  const [feedback, setFeedback] = useState<string>("");
  const [accept, setAccept] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const navigate = useNavigate();
  const { reportId } = useParams();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleUpdate = async () => {
    const response = await updatePostReport(reportId, accept, feedback);

    if (response) {
      navigate("/community/reports/posts");
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const response = await getPostReportDetails(reportId);

      if (response) {
        setReport(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    fetchReport();
  }, [reportId]);

  if (loading) return <Loading />;
  if (!report || error)
    return <ErrorComponent onRefresh={handleRefresh} label="새로고침" />;

  return (
    <Container>
      <Content>
        <Title>게시글 신고 상세</Title>
        <Column>
          <Subtitle>신고자</Subtitle>
          <Information>
            <div>식별자</div>
            <div>{report.report_user.uuid}</div>
          </Information>
          <Information>
            <div>이름</div>
            <div>{report.report_user.full_name}</div>
          </Information>
          <Information>
            <div>아이디</div>
            <div>{report.report_user.username}</div>
          </Information>
        </Column>
        <Column>
          <Subtitle>신고 정보</Subtitle>
          <Information>
            <div>신고 사유</div>
            <div>{report.reason}</div>
          </Information>
          <Information>
            <div>신고 내용</div>
            <div>{report.details}</div>
          </Information>
          <Information>
            <div>처리 상태</div>
            <div>{report.status}</div>
          </Information>
        </Column>
        <Column>
          <Subtitle>게시글 정보</Subtitle>
          <Information>
            <div>게시글 작성일</div>
            <div>{report.post.created_at}</div>
          </Information>
          <Information>
            <div>게시글 제목</div>
            <div>{report.post.title}</div>
          </Information>
          <Information>
            <div>게시글 내용</div>
            <div>{report.post.content}</div>
          </Information>
        </Column>
        <Divider bold />
      </Content>
      {report.status === "검토중" ? (
        <UpdateForm>
          <div>
            <div>
              <Subtitle>처리</Subtitle>
              <TextInput
                value={feedback}
                onChange={setFeedback}
                placeholder="처리 내용을 입력해주세요."
              />
            </div>
            <div>
              <Subtitle>결과</Subtitle>
              <div>
                <input
                  type="radio"
                  id="accept"
                  name="accept"
                  value="accept"
                  checked={accept}
                  onChange={() => setAccept(true)}
                />
                <label htmlFor="accept">승인</label>
                <input
                  type="radio"
                  id="reject"
                  name="accept"
                  value="reject"
                  checked={!accept}
                  onChange={() => setAccept(false)}
                />
                <label htmlFor="reject">거부</label>
              </div>
            </div>
          </div>
          <Button onClick={handleUpdate} data-testid={`update`}>
            처리
          </Button>
        </UpdateForm>
      ) : null}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 32px;
  gap: 16px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Subtitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  font-size: 18px;

  > div:first-child {
    display: flex;
    flex: 1;
  }

  > div:last-child {
    display: flex;
    flex: 4;
  }
`;

const UpdateForm = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 16px;

  > div:first-child {
    display: flex;
    flex-direction: column;
    padding-bottom: 32px;
    gap: 8px;
  }

  label {
    display: inline-block;
    margin: 0 8px 0 4px;
    font-size: 20px;
  }
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  font-size: 16px;
  font-weight: 600;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background100};
  border-radius: 8px;
  cursor: pointer;
`;
