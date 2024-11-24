import styled from "styled-components";

interface Props {
  bold?: boolean;
  color?: string;
}

export function Divider({ bold = false, color = "#0F0F70" }: Readonly<Props>) {
  return <StyledDivider $bold={bold} color={color} />;
}

const StyledDivider = styled.div<{ $bold: boolean; color: string }>`
  width: 100%;
  height: ${({ $bold }) => ($bold ? "2px" : "1px")};
  background-color: ${({ color }) => color};
`;
