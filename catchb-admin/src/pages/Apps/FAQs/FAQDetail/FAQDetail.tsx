import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { Divider } from "@components/Dividers";
import { ErrorComponent, Loading } from "@components/Fallbacks";
import { Menu } from "@components/Menus";
import { FAQType } from "@models/apps";
import { deleteFAQ, updateFAQ, getFAQ } from "@services/apps";

export function FAQDetail() {
  const [faq, setFAQ] = useState<FAQType>();
  const [questionInput, setQuestionInput] = useState<string>("");
  const [answerInput, setAnswerInput] = useState<string>("");

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const navigate = useNavigate();
  const { faqId } = useParams();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleClose = () => {
    navigate("/apps/faqs");
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    toggleMenu();
  };

  const handleUpdate = async () => {
    const response = await updateFAQ(faqId, questionInput, answerInput);

    if (response) {
      setIsEditMode(false);
      handleRefresh();
    } else {
      window.alert("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const response = await deleteFAQ(faqId);

      if (response) {
        handleClose();
      } else {
        window.alert("삭제에 실패했습니다.");
      }
    }
  };

  const options = [
    {
      label: "수정하기",
      onClick: handleEditClick,
    },
    {
      label: "삭제하기",
      onClick: handleDelete,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFAQ(faqId);

      if (response) {
        setFAQ(response);
        const question = response.question;
        const onlyQuestion = question.split("] ")[1];
        setQuestionInput(onlyQuestion);
        setAnswerInput(response.answer);
        setLoading(false);
      } else {
        setError(true);
      }
    };

    fetchData();
  }, [faqId, refreshCount]);

  if (loading) return <Loading />;
  if (error || !faq) return <ErrorComponent />;

  return (
    <Container>
      <Contents>
        {isEditMode ? (
          <InputArea>
            <div>질문</div>
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="질문을 입력하세요"
              data-testid="title-input"
            />
          </InputArea>
        ) : (
          <Header>
            <div>{faq.question}</div>
            <Menu
              options={options}
              isOpen={isMenuOpen}
              toggleDropdown={toggleMenu}
            />
          </Header>
        )}
        <Wrapper>
          <Divider />
        </Wrapper>
        {isEditMode ? (
          <InputArea>
            <div>답변</div>
            <textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="내용을 입력하세요"
              data-testid="content-input"
            />
          </InputArea>
        ) : (
          <Content>{faq.answer}</Content>
        )}
      </Contents>
      {isEditMode && (
        <Buttons>
          <Button onClick={toggleEditMode} $negative>
            취소
          </Button>
          <Button onClick={handleUpdate}>수정하기</Button>
        </Buttons>
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

const Contents = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  > div:first-child {
    font-size: 1.3rem;
    font-weight: 500;
  }

  > input {
    padding: 8px;

    border-radius: 4px;
    border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
  }

  > textarea {
    height: 400px;
    padding: 8px;
    border-radius: 4px;
    border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  > div:first-child {
    font-size: 1.6rem;
    font-weight: 500;
  }
`;

const Wrapper = styled.div`
  display: flex;
  padding: 16px 0;
`;

const Content = styled.p`
  font-size: 16px;
  line-height: 2;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const Button = styled.div<{ $negative?: boolean }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 8px;

  color: ${({ $negative, theme }) => ($negative ? theme.colors.foreground900 : theme.colors.background100)};
  border-radius: 4px;
  background-color: ${({ $negative, theme }) =>
    $negative ? theme.colors.borderLight : theme.colors.primary};
  cursor: pointer;
`;
