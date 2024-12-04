import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { Divider } from "@components/Dividers";
import { ErrorComponent, Loading } from "@components/Fallbacks";
import { Menu } from "@components/Menus";
import { NoticeType } from "@models/apps";
import { deleteNotice, updateNotice, getNotice } from "@services/apps";

export function NoticeDetail() {
  const [notice, setNotice] = useState<NoticeType>();
  const [titleInput, setTitleInput] = useState<string>("");
  const [contentInput, setContentInput] = useState<string>("");

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const navigate = useNavigate();
  const { noticeId } = useParams();

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
    navigate("/apps/notices");
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    toggleMenu();
  };

  const handleUpdate = async () => {
    const response = await updateNotice(noticeId, titleInput, contentInput);

    if (response) {
      setIsEditMode(false);
      handleRefresh();
    } else {
      window.alert("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const response = await deleteNotice(noticeId);

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
      setLoading(true);
      setError(false);

      const response = await getNotice(noticeId);

      if (response) {
        setNotice(response);
        setTitleInput(response.title);
        setContentInput(response.content);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [noticeId, refreshCount]);

  if (loading) {
    return <Loading />;
  }

  if (!notice || error) {
    return <ErrorComponent />;
  }

  return (
    <Container>
      {isEditMode ? (
        <Wrapper>
          <Subtitle>제목</Subtitle>
          <TitleInput
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="제목을 입력하세요"
            data-testid="title-input"
          />
        </Wrapper>
      ) : (
        <Horizontal>
          <Title>{notice.title}</Title>
          <Menu
            options={options}
            isOpen={isMenuOpen}
            toggleDropdown={toggleMenu}
          />
        </Horizontal>
      )}
      <div>생성일: {notice.updated_at}</div>
      <Divider />
      {isEditMode ? (
        <ContentInput
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
          placeholder="내용을 입력하세요"
          data-testid="content-input"
        />
      ) : (
        <Content>{notice.content}</Content>
      )}
      {isEditMode && (
        <Horizontal>
          <Cancel onClick={toggleEditMode}>취소</Cancel>
          <Button onClick={handleUpdate}>저장</Button>
        </Horizontal>
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

const Horizontal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
`;

const Subtitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 500;
`;

const TitleInput = styled.input`
  padding: 8px;

  border-radius: 4px;
  border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
`;

const Content = styled.p`
  font-size: 16px;
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
  flex: 1;
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

const Cancel = styled(Button)`
  background-color: ${({ theme }) => theme.colors.background100};
  color: ${({ theme }) => theme.colors.primary};
`;
