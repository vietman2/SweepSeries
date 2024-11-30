import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import styled from "styled-components";

import { ContentInput } from "@components/Inputs";
import { createTerms } from "@services/apps";

export function TermsCreate() {
  const [title, setTitle] = useState<string>("");
  const [isRequired, setIsRequired] = useState<boolean>(true);
  const [hasContent, setHasContent] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  const quillRef = useRef<ReactQuill>(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const content = hasContent ? quillRef.current?.getEditor().getText() : "";

    const response = await createTerms(title, content, isRequired);

    if (response) {
      navigate("/apps/terms");
    } else {
      window.alert("약관 생성에 실패했습니다.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>약관 생성</Title>
        <FieldContainer>
          <div>약관 제목</div>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="label"
            />
          </div>
        </FieldContainer>
        <FieldContainer>
          <div>필수 여부</div>
          <div>
            <input
              type="checkbox"
              checked={isRequired}
              onChange={() => setIsRequired(!isRequired)}
              data-testid="isRequired"
            />
          </div>
        </FieldContainer>
        <FieldContainer>
          <div>내용 여부</div>
          <div>
            <input
              type="checkbox"
              checked={hasContent}
              onChange={() => setHasContent(!hasContent)}
              data-testid="hasContent"
            />
          </div>
        </FieldContainer>
        {hasContent && (
          <>
            <Subtitle>내용</Subtitle>
            <ContentInput
              content={content}
              setContent={setContent}
              ref={quillRef}
            />
          </>
        )}
      </Wrapper>
      <Button onClick={handleSubmit} data-testid="create">
        생성
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 32px;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
`;

const Subtitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 500;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > div:first-child {
    flex: 1;

    font-size: 1.1rem;
    font-weight: 500;
  }

  > div:last-child {
    flex: 4;
  }

  input[type="text"] {
    width: 100%;
    padding: 8px;

    border-radius: 4px;
    border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
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
