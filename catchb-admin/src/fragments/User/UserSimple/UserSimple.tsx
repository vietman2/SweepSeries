import styled from "styled-components";

import { UserType } from "@models/members";

export function UserSimpleHeader() {
  return (
    <Header>
      <div>UUID</div>
      <div>이름</div>
      <div>아이디</div>
      <div>이메일</div>
      <div>가입일</div>
    </Header>
  );
}

interface Props {
  user: UserType;
}

export function UserSimple({ user }: Readonly<Props>) {
  return (
    <Container>
      <div>{user.uuid}</div>
      <div>{user.person.full_name}</div>
      <div>{user.username}</div>
      <div>{user.email}</div>
      <div>{user.joined_at}</div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  font-size: 16px;
  color: ${({ theme }) => theme.colors.foreground700};

  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 36px;
    padding: 8px;
    gap: 6px;

    white-space: nowrap;

    border-right: 1px solid ${({ theme }) => theme.colors.borderLight};
  }

  > div:first-child {
    width: 320px;
  }

  > div:nth-child(4) {
    width: 240px;
  }

  > div:last-child {
    border-right: none;
  }
`;

const Header = styled(Container)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.foreground900};
`;
