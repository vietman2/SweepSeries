import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ColorPicker, ColorService, useColor } from "react-color-palette";
import "react-color-palette/css";

import { Divider } from "@components/Dividers";
import { ErrorComponent, Loading } from "@components/Fallbacks";
import { TagPreview } from "@fragments/Tag";
import { createTag, getTag, updateTag } from "@services/community";

const forums = ["덕아웃", "드래프트", "장터"];

export function TagWrite() {
  const [selectedForum, setSelectedForum] = useState<string>("덕아웃");
  const [label, setLabel] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [color, setColor] = useColor("#000000");
  const [bgColor, setBgColor] = useColor("#ffffff");

  const navigate = useNavigate();
  const location = useLocation();
  const { tagId } = useParams();

  const editMode = location.pathname.includes("edit");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleBack = () => {
    navigate("/community/tags");
  };

  const handleCreateTag = async () => {
    const response = await createTag(
      selectedForum,
      label,
      icon,
      color.hex,
      bgColor.hex
    );

    if (response) {
      handleBack();
    } else {
      alert("태그 추가에 실패했습니다.");
    }
  };

  const handleEditTag = async () => {
    const response = await updateTag(
      tagId,
      label,
      icon,
      color.hex,
      bgColor.hex
    );

    if (response) {
      handleBack();
    } else {
      alert("태그 수정에 실패했습니다.");
    }
  };

  const handleSubmit = () => {
    if (editMode) {
      handleEditTag();
    } else {
      handleCreateTag();
    }
  };

  useEffect(() => {
    const getTagDetails = async () => {
      if (!editMode) {
        setLoading(false);
        return;
      }

      if (!tagId) {
        setError(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await getTag(tagId);

      if (response) {
        const { forum_name, name, icon, color, bgcolor } = response;

        setSelectedForum(forum_name);
        setLabel(name);
        setIcon(icon);
        setColor(ColorService.convert("hex", color));
        setBgColor(ColorService.convert("hex", bgcolor));
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    getTagDetails();
  }, [editMode, tagId]);

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
        <ErrorComponent label="뒤로가기" onRefresh={handleBack} />
      </Container>
    );
  }

  return (
    <Container>
      <Subtitle>{editMode ? "태그 수정" : "태그 추가"}</Subtitle>
      <Contents>
        <FieldContainer>
          <div>게시판</div>
          <div>
            <select
              value={selectedForum}
              onChange={(e) => setSelectedForum(e.target.value)}
              data-testid="forum"
            >
              {forums.map((forum) => (
                <option key={forum}>{forum}</option>
              ))}
            </select>
          </div>
        </FieldContainer>
        <FieldContainer>
          <div>이름</div>
          <div>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              data-testid="label"
            />
          </div>
        </FieldContainer>
        <FieldContainer>
          <div>아이콘 링크</div>
          <div>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              data-testid="icon"
            />
          </div>
        </FieldContainer>
        <FieldContainer>
          <div>폰트 색상</div>
          <div>
            <ContentWrapper>
              <ColorPicker
                hideInput={["rgb", "hsv"]}
                height={50}
                color={color}
                onChange={setColor}
                hideAlpha
              />
            </ContentWrapper>
          </div>
        </FieldContainer>
        <FieldContainer>
          <div>배경 색상</div>
          <div>
            <ContentWrapper>
              <ColorPicker
                hideInput={["rgb", "hsv"]}
                height={50}
                color={bgColor}
                onChange={setBgColor}
                hideAlpha
              />
            </ContentWrapper>
          </div>
        </FieldContainer>
        <Divider bold />
        <FieldContainer>
          <div>미리보기 (S)</div>
          <div>
            <ContentWrapper>
              <TagPreview
                label={label}
                icon={icon}
                color={color.hex}
                bgColor={bgColor.hex}
                small
              />
            </ContentWrapper>
          </div>
        </FieldContainer>
        <FieldContainer>
          <div>미리보기 (L)</div>
          <div>
            <ContentWrapper>
              <TagPreview
                label={label}
                icon={icon}
                color={color.hex}
                bgColor={bgColor.hex}
              />
            </ContentWrapper>
          </div>
        </FieldContainer>
      </Contents>
      <Button onClick={handleSubmit}>
        {editMode ? "수정하기" : "추가하기"}
      </Button>
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

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
`;

const Contents = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
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

  select {
    padding: 8px;

    border-radius: 4px;
    border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
  }

  input {
    width: 100%;
    padding: 8px;

    border-radius: 4px;
    border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
`;

const Button = styled.button`
  padding: 8px 16px;

  color: white;
  font-size: 1.2rem;
  font-weight: 500;

  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};

  cursor: pointer;
`;
