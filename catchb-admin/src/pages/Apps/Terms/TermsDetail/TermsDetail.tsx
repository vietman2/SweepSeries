import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { Divider } from "@components/Dividers";
import { ErrorComponent, Loading } from "@components/Fallbacks";
import { TermType } from "@models/apps";
import { deleteTerm, updateTerm, getTerm } from "@services/apps";

export function TermsDetail() {
  const [term, setTerm] = useState<TermType>();
  const [editContent, setEditContent] = useState<string>("");
  const [editSummary, setEditSummary] = useState<string>("");

  const [contentMode, setContentMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { termId } = useParams();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
    setContentMode(false);
  };

  const handleDetailClick = (content: string) => {
    setContentMode(true);
    setEditContent(content);
    setEditSummary("");
  };

  const handleUpdate = async () => {
    const response = await updateTerm(termId, editContent, editSummary);

    if (response) {
      window.alert("수정이 완료되었습니다.");
      handleRefresh();
    } else {
      window.alert("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const response = await deleteTerm(termId);

      if (response) {
        window.alert("삭제가 완료되었습니다.");
        handleRefresh();
      } else {
        window.alert("삭제에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const reponse = await getTerm(termId);

      if (reponse) {
        setTerm(reponse);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [termId, refreshCount]);

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (!term || error) {
    return (
      <Container>
        <ErrorComponent onRefresh={handleRefresh} label="새로고침" />
      </Container>
    );
  }

  if (contentMode) {
    return (
      <ContentMode>
        <Wrapper>
          <Header>
            <Subtitle>약관 내용 : {term.title}</Subtitle>
            <Button onClick={() => setContentMode(false)}>닫기</Button>
          </Header>
          {!editContent && (
            <NoContent>아직 내용이 없는 동의 항목입니다.</NoContent>
          )}
          <ContentInput
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="내용을 입력해주세요."
            data-testid="content"
          />
          <Divider />
          <div>개정 내용 요약</div>
          <input
            type="text"
            value={editSummary}
            onChange={(e) => setEditSummary(e.target.value)}
            placeholder="요약"
          />
        </Wrapper>
        <Button
          onClick={handleUpdate}
          style={{ backgroundColor: "#0F0F70", color: "white" }}
        >
          수정하기
        </Button>
      </ContentMode>
    );
  }

  return (
    <Container>
      <Header>
        <Subtitle>약관 상세</Subtitle>
        {!term.deleted && <Button onClick={handleDelete}>약관 삭제하기</Button>}
      </Header>
      <Content>
        <Row>
          <div>약관 제목</div>
          <div>
            ({term.required ? "필수" : "선택"}) {term.title}
          </div>
        </Row>
        <Row>
          <div>생성일</div>
          <div>{term.created_at}</div>
        </Row>
        <Row>
          <div>최종 수정일</div>
          <div>{term.updated_at}</div>
        </Row>
      </Content>
      <Divider bold />
      <Row>
        <Subtitle>약관 내용</Subtitle>
        <Button onClick={() => handleDetailClick(term.content)}>
          확인하기
        </Button>
      </Row>
      <Divider bold />
      <Subtitle>약관 개정 내역</Subtitle>
      <List>
        <HeaderRow>
          <div>주요 내용</div>
          <div>수정일</div>
        </HeaderRow>
        {term.history.map((history) => (
          <History key={history.id}>
            <div>{history.summary}</div>
            <div>{history.created_at}</div>
          </History>
        ))}
      </List>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 32px;
  gap: 32px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Subtitle = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContentInput = styled.textarea`
  display: flex;
  flex: 1;
  padding: 8px;

  border-radius: 4px;
  border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
`;

const Wrapper = styled(Content)`
  flex: 1;

  input {
    padding: 8px;
    border: 1px solid ${({ theme }) => theme.colors.borderLight};
    border-radius: 8px;
  }
`;

const Row = styled.div`
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

const List = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
`;

const History = styled.div`
  display: flex;
  flex-direction: row;

  font-size: 16px;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
  }

  > div:first-child {
    flex: 4;
  }

  > div:last-child {
    flex: 1.5;
  }
`;

const HeaderRow = styled(History)`
  font-weight: bold;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
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

const ContentMode = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NoContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 400;
`;
