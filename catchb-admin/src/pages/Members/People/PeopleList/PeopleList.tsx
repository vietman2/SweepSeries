import { useEffect, useState } from "react";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import { PersonSimple, PersonSimpleHeader } from "@fragments/Person";
import { PersonType } from "@models/members";
import { getPeople } from "@services/auth";

export function PeopleList() {
  const [people, setPeople] = useState<PersonType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await getPeople();

      if (response) {
        setPeople(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [refreshCount]);

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
      <Title>미가입 회원 목록</Title>
      <List>
        <PersonSimpleHeader />
        {people.map((person) => (
          <PersonSimple key={person.phone_number} person={person} />
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
