import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

import { Divider } from "@components/Dividers";
import { TagPreview } from "@fragments/Tag";
import { createTag } from "@services/community";

const forums = ["덕아웃", "드래프트", "장터"];

export function TagWrite() {
  const [selectedForum, setSelectedForum] = useState<string>("덕아웃");
  const [label, setLabel] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [color, setColor] = useColor("#121212");
  const [bgColor, setBgColor] = useColor("#ffffff");

  const navigate = useNavigate();

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

  return (
    <Container>
      <Subtitle>태그 추가</Subtitle>
      <Contents>
        <FieldContainer>
          <div>게시판</div>
          <div>
            <select
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
      <Button onClick={handleCreateTag}>추가하기</Button>
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
