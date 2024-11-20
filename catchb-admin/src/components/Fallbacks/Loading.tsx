import styled, { keyframes } from "styled-components";

export function Loading() {
  return (
    <Container>
      <Spinner />
    </Container>
  );
}

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 8px solid ${({ theme }) => theme.colors.background100};
  border-top: 8px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;
