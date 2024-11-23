import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import { TagChip } from "@fragments/Tag";
import { TagType } from "@models/community";
import { getTags } from "@services/community";

export function TagList() {
  const [tags, setTags] = useState<Record<string, TagType[]>>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleTagCreate = () => {
    navigate("/community/tags/create");
  };

  const handleTagDetail = (tagId: number) => {
    navigate(`/community/tags/${tagId}`);
  };

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      const response = await getTags();

      if (response) {
        setTags(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    if (location.pathname === "/community/tags") {
      fetchTags();
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
        <Button onClick={handleTagCreate}>태그 추가</Button>
      </div>
      <Wrapper>
        <div>덕아웃</div>
        <Chips>
          {tags["덕아웃"].map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagDetail(tag.id)}
              data-testid={`tag-chip-${tag.id}`}
            >
              <TagChip key={tag.id} tag={tag} />
            </button>
          ))}
        </Chips>
      </Wrapper>
      <Wrapper>
        <div>드래프트</div>
        <Chips>
          {tags["드래프트"].map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagDetail(tag.id)}
              data-testid={`tag-chip-${tag.id}`}
            >
              <TagChip key={tag.id} tag={tag} />
            </button>
          ))}
        </Chips>
      </Wrapper>
      <Wrapper>
        <div>장터</div>
        <Chips>
          {tags["장터"].map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagDetail(tag.id)}
              data-testid={`tag-chip-${tag.id}`}
            >
              <TagChip key={tag.id} tag={tag} />
            </button>
          ))}
        </Chips>
      </Wrapper>
      <Wrapper>
        <div>스틸</div>
        <Chips>
          {tags["스틸"].map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagDetail(tag.id)}
              data-testid={`tag-chip-${tag.id}`}
            >
              <TagChip key={tag.id} tag={tag} />
            </button>
          ))}
        </Chips>
      </Wrapper>
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
  background-color: #f5f5f5;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  font-size: 1.25rem;
  font-weight: 600;
`;

const Chips = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;
