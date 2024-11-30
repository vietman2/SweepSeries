import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import { TermType } from "@models/apps";
import { getTerms } from "@services/apps";

export function TermsList() {
  const [terms, setTerms] = useState<TermType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleCreate = () => {
    navigate("/apps/terms/create");
  };

  const handleDetail = (termId: number) => {
    navigate(`/apps/terms/${termId}`);
  };

  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      const response = await getTerms();

      if (response) {
        setTerms(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    if (location.pathname === "/apps/terms") {
      fetchTerms();
    }
  }, [refreshCount, location]);

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorComponent label="새로고침" onRefresh={handleRefresh} />
      </Container>
    );
  }

  return (
    <Container>
      <div>
        <Button onClick={handleCreate}>약관 추가</Button>
      </div>
      <List>
        <Header>
          <div>No.</div>
          <div>약관 제목</div>
          <div>생성일</div>
          <div>수정일</div>
        </Header>
        {terms.map((term) => (
          <Row
            key={term.id}
            onClick={() => handleDetail(term.id)}
            data-testid={`term-${term.id}`}
          >
            <div>{term.id}</div>
            {term.deleted ? (
              <div>(삭제됨) {term.title}</div>
            ) : (
              <div>
                {term.required ? "(필수) " : "(선택) "}
                {term.title}
              </div>
            )}
            <div>{term.created_at}</div>
            <div>{term.updated_at}</div>
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
