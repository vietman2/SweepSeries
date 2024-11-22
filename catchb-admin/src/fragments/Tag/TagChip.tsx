import styled from "styled-components";

import { TagType } from "@models/community";

interface Props {
  tag: TagType;
}

export function TagChip({ tag }: Readonly<Props>) {
  return (
    <TagChipWrapper style={{ backgroundColor: tag.bgcolor }}>
      <img src={tag.icon} alt={tag.name} />
      <div style={{ color: tag.color }}>{tag.name}</div>
    </TagChipWrapper>
  );
}

const TagChipWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 6px 12px;
  gap: 8px;

  font-size: 1rem;

  img {
    width: 24px;
    height: 24px;
  }
`;
