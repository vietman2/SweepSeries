import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import { NoticeType } from "@models/apps";
import { getNotices } from "@services/apps";

export function NoticesList() {
  const [notices, setNotices] = useState<NoticeType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleCreate = () => {
    navigate("/apps/notices/create");
  };

  const handleDetail = (noticeId: number) => {
    navigate(`/apps/notices/${noticeId}`);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      const response = await getNotices();

      if (response) {
        setNotices(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    if (location.pathname === "/apps/notices") {
      fetchNotices();
    }
  }, [refreshCount, location]);

  if (loading) {
    return (
    <Container>
      <Loading />
    </Container>);
  }

  if (error) {
    return (
      <Container>
        <ErrorComponent onRefresh={handleRefresh} label="새로고침" />
      </Container>
    );
  }

  return (
    <Container>
      <div>
        <Button onClick={handleCreate}>공지 추가</Button>
      </div>
      <List>
        <Header>
          <div>No.</div>
          <div>제목</div>
          <div>작성일</div>
          <div>수정일</div>
        </Header>
        {notices.map((notice, index) => (
          <Row
            key={notice.id}
            onClick={() => handleDetail(notice.id)}
            data-testid={`notice-${notice.id}`}
          >
            <div>{index + 1}</div>
            <div>
              {notice.is_deleted ? (
                <s>
                  <div>{notice.title}</div>
                </s>
              ) : (
                <div>{notice.title}</div>
              )}
            </div>
            <div>{notice.created_at}</div>
            <div>{notice.updated_at}</div>
          </Row>
        ))}
      </List>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
  gap: 32px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background100};
  color: ${({ theme }) => theme.colors.foreground900};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

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
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    width: 140px;

    border-right: 1px solid ${({ theme }) => theme.colors.borderLight};

    white-space: nowrap;
    overflow: hidden;
  }

  > div:first-child {
    width: 60px;
  }

  > div:nth-child(2) {
    flex: 1;
    justify-content: flex-start;
    max-width: 400px;
    font-size: 18px;
  }

  > div:last-child {
    border-right: none;
  }
`;

const Header = styled(Row)`
  font-size: 18px;
  font-weight: bold;

  border-top: none;

  > div:nth-child(2) {
    justify-content: center;
  }
`;
