import styled from "styled-components";

interface Props {
  onRefresh: () => void;
  text?: string;
  label?: string;
}

export function ErrorComponent({
  onRefresh,
  text = "오류가 발생했습니다.",
  label = "새로고침",
}: Readonly<Props>) {
  return (
    <Container>
      <div>{text}</div>
      <RefreshButton onClick={onRefresh}>{label}</RefreshButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;

  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-align: center;

  z-index: 1000;
`;

const RefreshButton = styled.button`
  padding: 8px 16px;
  color: ${({ theme }) => theme.colors.background100};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background700};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background900};
  }
`;
