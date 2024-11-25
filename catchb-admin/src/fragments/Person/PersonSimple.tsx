import styled from "styled-components";

import { PersonType } from "@models/members";

export function PersonSimpleHeader() {
  return (
    <Header>
      <div>이름</div>
      <div>전화번호</div>
    </Header>
  );
}

interface Props {
  person: PersonType;
}

export function PersonSimple({ person }: Readonly<Props>) {
  return (
    <Container>
      <div>{person.full_name}</div>
      <div>{person.phone_number}</div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  font-size: 16px;
  color: ${({ theme }) => theme.colors.foreground700};

  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: 36px;
    padding: 8px;
    gap: 6px;

    white-space: nowrap;

    border-right: 1px solid ${({ theme }) => theme.colors.borderLight};
  }

  > div:last-child {
    border-right: none;
  }
`;

const Header = styled(Container)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.foreground900};

  border-top: none;
`;
