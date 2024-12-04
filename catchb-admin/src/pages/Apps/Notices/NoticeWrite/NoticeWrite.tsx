import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { createNotice } from "@services/apps";

export function NoticeWrite() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await createNotice(title, content);

    if (response) {
      navigate("/apps/notices");
    } else {
      window.alert("공지 생성에 실패했습니다.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>새 공지</Title>
        <TitleInput>
          <Subtitle>제목</Subtitle>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </TitleInput>
        <Wrapper>
          <Subtitle>내용</Subtitle>
          <ContentInput
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </Wrapper>
      </Wrapper>
      <Button onClick={handleSubmit}>등록</Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px 32px;
  gap: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
`;

const TitleInput = styled.div`
  display: flex;
  flex-direction: column;

  input[type="text"] {
    width: 100%;
    padding: 8px;

    border-radius: 4px;
    border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
  }
`;

const Subtitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 500;
`;

const ContentInput = styled.textarea`
  display: flex;
  flex: 1;
  padding: 8px;

  border-radius: 4px;
  border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  padding: 8px;

  font-size: 20px;
  font-weight: 600;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background100};
  border-radius: 8px;
  cursor: pointer;
`;
