import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { Divider } from "@components/Dividers";
import { ErrorComponent, Loading } from "@components/Fallbacks";
import { Menu } from "@components/Menus";
import { TagChip } from "@fragments/Tag";
import { TagType } from "@models/community";
import { getTag, deleteTag } from "@services/community";

export function TagDetail() {
  const [tag, setTag] = useState<TagType>();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const navigate = useNavigate();
  const { tagId } = useParams();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClose = () => {
    navigate("/community/tags");
  };

  const handleEditClick = () => {
    navigate(`/community/tags/${tagId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const response = await deleteTag(tagId);

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
    const getTagDetails = async () => {
      setLoading(true);
      const response = await getTag(tagId);

      if (response) {
        setTag(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    getTagDetails();
  }, [tagId, refreshCount]);

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (error || !tag) {
    return (
      <Container>
        <ErrorComponent label="새로고침" onRefresh={handleRefresh} />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Subtitle>태그 상세</Subtitle>
        <Menu
          options={options}
          isOpen={isMenuOpen}
          toggleDropdown={toggleMenu}
        />
      </Header>
      <Horizontal>
        <div>게시판</div>
        <div>{tag.forum_name}</div>
      </Horizontal>
      <Horizontal>
        <div>태그 이름</div>
        <div>{tag.name}</div>
      </Horizontal>
      <Horizontal>
        <div>링크</div>
        <div>{tag.icon}</div>
      </Horizontal>
      <Horizontal>
        <div>폰트 색상</div>
        <div>
          <Dot style={{ backgroundColor: tag.color }} />(
          {tag.color.toUpperCase()})
        </div>
      </Horizontal>
      <Horizontal>
        <div>배경 색상</div>
        <div>
          <Dot style={{ backgroundColor: tag.bgcolor }} />(
          {tag.bgcolor.toUpperCase()})
        </div>
      </Horizontal>
      <Divider />
      <Preview>
        <div>미리보기</div>
        <TagChip tag={tag} />
      </Preview>
      <div />
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

const Horizontal = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;

  > div:first-child {
    flex: 1;
    font-size: 20px;
    font-weight: 600;
  }

  > div:last-child {
    display: flex;
    flex: 5;
    align-items: center;
    gap: 8px;

    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Preview = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 36px;

  font-size: 20px;
  font-weight: 600;
`;

const Dot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;
