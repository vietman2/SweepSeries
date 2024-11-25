import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import { UserSimpleHeader, UserSimple } from "@fragments/User";
import { UserType } from "@models/members";
import { getUsers } from "@services/auth";

export function UserList() {
  const [users, setUsers] = useState<UserType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleUserDetail = (userId: string) => {
    navigate(`/members/users/${userId}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await getUsers();

      if (response) {
        setUsers(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    if (location.pathname === "/members/users") {
      fetchUsers();
    }
  }, [refreshCount, location]);

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorComponent label="새로고침" onRefresh={handleRefresh} />
      </Container>
    );
  }

  return (
    <Container>
      <Title>사용자 목록</Title>
      <List>
        <UserSimpleHeader />
        {users.map((user) => (
          <button
            key={user.uuid}
            onClick={() => handleUserDetail(user.uuid)}
            data-testid={`user-${user.uuid}`}
          >
            <UserSimple user={user} />
          </button>
        ))}
      </List>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;

  button {
    cursor: pointer;
  }
`;
