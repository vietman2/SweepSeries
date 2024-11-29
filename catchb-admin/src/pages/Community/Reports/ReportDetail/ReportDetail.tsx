import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { Divider } from "@components/Dividers";
import { ErrorComponent, Loading } from "@components/Fallbacks";
import { TextInput } from "@components/Inputs";
import {
  CommentReportType,
  ReCommentReportType,
  PostReportType,
  ReportType,
} from "@models/community";
import {
  getCommentReportDetails,
  getPostReportDetails,
  getReCommentReportDetails,
  updatePostReport,
  updateCommentReport,
  updateReCommentReport,
} from "@services/community";

export function PostReportDetail() {
  const [report, setReport] = useState<PostReportType>();

  const updateData = async (
    reportId: string | undefined,
    accept: boolean,
    feedback: string
  ) => {
    const response = await updatePostReport(reportId, accept, feedback);

    if (response) {
      return true;
    }

    return false;
  };

  const fetchData = async (id: string | undefined) => {
    const response = await getPostReportDetails(id);

    if (response) {
      setReport(response);
      return true;
    }

    return false;
  };

  return (
    <ReportDetail
      title="게시글"
      report={report}
      fetchData={fetchData}
      updateData={updateData}
      previousPath="/community/reports/posts"
    >
      <Column>
        <Subtitle>게시글 정보</Subtitle>
        <Information>
          <div>게시글 작성일</div>
          <div>{report?.post.created_at}</div>
        </Information>
        <Information>
          <div>게시글 제목</div>
          <div>{report?.post.title}</div>
        </Information>
        <Information>
          <div>게시글 내용</div>
          <div>{report?.post.content}</div>
        </Information>
      </Column>
    </ReportDetail>
  );
}

export function CommentReportDetail() {
  const [report, setReport] = useState<CommentReportType>();

  const updateData = async (
    reportId: string | undefined,
    accept: boolean,
    feedback: string
  ) => {
    const response = await updateCommentReport(reportId, accept, feedback);

    if (response) {
      return true;
    }

    return false;
  };

  const fetchData = async (id: string | undefined) => {
    const response = await getCommentReportDetails(id);

    if (response) {
      setReport(response);
      return true;
    }

    return false;
  };

  return (
    <ReportDetail
      title="댓글"
      report={report}
      fetchData={fetchData}
      updateData={updateData}
      previousPath="/community/reports/comments"
    >
      <Column>
        <Subtitle>댓글 정보</Subtitle>
        <Information>
          <div>댓글 작성일</div>
          <div>{report?.comment.created_at}</div>
        </Information>
        <Information>
          <div>댓글 내용</div>
          <div>{report?.comment.content}</div>
        </Information>
      </Column>
    </ReportDetail>
  );
}

export function ReCommentReportDetail() {
  const [report, setReport] = useState<ReCommentReportType>();

  const updateData = async (
    reportId: string | undefined,
    accept: boolean,
    feedback: string
  ) => {
    const response = await updateReCommentReport(reportId, accept, feedback);

    if (response) {
      return true;
    }

    return false;
  };

  const fetchData = async (id: string | undefined) => {
    const response = await getReCommentReportDetails(id);

    if (response) {
      setReport(response);
      return true;
    }

    return false;
  };

  return (
    <ReportDetail
      title="대댓글"
      report={report}
      fetchData={fetchData}
      updateData={updateData}
      previousPath="/community/reports/recomments"
    >
      <Column>
        <Subtitle>대댓글 정보</Subtitle>
        <Information>
          <div>대댓글 작성일</div>
          <div>{report?.recomment.created_at}</div>
        </Information>
        <Information>
          <div>대댓글 내용</div>
          <div>{report?.recomment.content}</div>
        </Information>
      </Column>
    </ReportDetail>
  );
}

interface Props {
  title: string;
  report: ReportType | undefined;
  fetchData: (id: string | undefined) => Promise<boolean>;
  updateData: (
    reportId: string | undefined,
    accept: boolean,
    feedback: string
  ) => Promise<boolean>;
  previousPath: string;
  children: React.ReactNode;
}

function ReportDetail({
  title,
  report,
  fetchData,
  updateData,
  previousPath,
  children,
}: Readonly<Props>) {
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
    const result = await updateData(reportId, accept, feedback);

    if (result) {
      navigate(previousPath);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const result = await fetchData(reportId);

      if (result) {
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
        <Title>{title} 신고 상세</Title>
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
        {children}
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
          <Button onClick={handleUpdate} data-testid="update">
            처리
          </Button>
        </UpdateForm>
      ) : (
        <Wrapper>
          <Title>처리 완료</Title>
        </Wrapper>
      )}
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

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;
