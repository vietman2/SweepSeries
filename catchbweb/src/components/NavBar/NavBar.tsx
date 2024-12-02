import styled from "styled-components";

import catchb from "@assets/catchb.svg";

export function NavBar() {
  return (
    <Container>
      <Wrapper>
        <img src={catchb} alt="catchb" />
      </Wrapper>
    </Container>
  );
}

const Container = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 110px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
  color: #f2f2f2;
  z-index: 1000;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 80px;

  > img {
    height: 20px;
  }

  @media (max-width: 768px) {
    padding: 20px;

    > img {
      height: 12px;
    }
  }
`;
