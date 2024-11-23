import styled from "styled-components";

import { TagType } from "@models/community";

interface Props {
  tag: TagType;
  small?: boolean;
}

export function TagChip({ tag, small = false }: Readonly<Props>) {
  return (
    <TagChipWrapper style={{ backgroundColor: tag.bgcolor }}>
      <img src={tag.icon} alt={tag.name} />
      {small ? null : <div style={{ color: tag.color }}>{tag.name}</div>}
    </TagChipWrapper>
  );
}

interface PreviewProps {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  small?: boolean;
}

export function TagPreview({
  label,
  icon,
  color,
  bgColor,
  small = false,
}: Readonly<PreviewProps>) {
  return (
    <TagChipWrapper style={{ backgroundColor: bgColor }}>
      {icon ? <img src={icon} alt={label} /> : <Placeholder />}
      {small ? null : <div style={{ color }}>{label}</div>}
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

const Placeholder = styled.div`
  width: 24px;
  height: 24px;

  border-radius: 50%;
  background-color: #000;
`;
