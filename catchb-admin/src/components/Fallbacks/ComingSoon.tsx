import styled from "styled-components";

export function ComingSoon() {
  return (
    <Container>
      <h1>Coming Soon</h1>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;

  color: ${({ theme }) => theme.colors.foreground300};

  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.background300};
`;
