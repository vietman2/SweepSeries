import styled from "styled-components";

interface Props {
  height?: string;
  bold?: boolean;
}

export function VerticalDivider({ height = "100%", bold = false }: Readonly<Props>) {
  return <Divider $bold={bold} height={height} />;
}

const Divider = styled.div<{ color?: string; $bold?: boolean; height?: string }>`
  width: ${({ $bold }) => ($bold ? "2px" : "1px")};
  height: ${({ height }) => height};
  background-color: ${({ theme }) => theme.colors.borderLight};
`;
