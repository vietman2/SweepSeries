import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { createFAQ } from "@services/apps";

const categories = ["예약", "아카데미", "레슨", "이벤트", "프로모드"];

export function FAQCreate() {
  const [selectedCategory, setSelectedCategory] = useState<string>("예약");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await createFAQ(selectedCategory, question, answer);

    if (response) {
      navigate("/apps/faqs");
    } else {
      window.alert("FAQ 생성에 실패했습니다.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <h1>새 FAQ</h1>
        <Category>
          <div>카테고리</div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            data-testid="category-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Category>
        <InputWrapper>
          <div>질문</div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="질문을 입력하세요"
            data-testid="question-input"
          />
        </InputWrapper>
        <InputWrapper>
          <div>답변</div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="답변을 입력하세요"
            data-testid="answer-input"
          />
        </InputWrapper>
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

const Category = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;

  > div {
    font-size: 1.3rem;
    font-weight: 500;
  }

  select {
    padding: 8px;

    border-radius: 4px;
    border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;

  > div:last-child {
    flex: 1;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  > div {
    font-size: 1.3rem;
    font-weight: 500;
  }

  input[type="text"] {
    width: 100%;
    padding: 8px;

    border-radius: 4px;
    border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
  }

  textarea {
    display: flex;
    flex: 1;
    padding: 8px;

    border-radius: 4px;
    border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
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
