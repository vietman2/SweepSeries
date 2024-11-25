import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { Divider } from "@components/Dividers";
import { ErrorComponent, Loading } from "@components/Fallbacks";
import { UserProfile } from "@fragments/User";
import { UserType } from "@models/members";
import { getUserDetails } from "@services/auth";

export function UserDetail() {
  const [user, setUser] = useState<UserType>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { userId } = useParams();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUserDetails(userId);

      if (response) {
        setUser(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    fetchUser();
  }, [userId, refreshCount]);

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container>
        <ErrorComponent label="새로고침" onRefresh={handleRefresh} />
      </Container>
    );
  }

  return (
    <Container>
      <Title>사용자 정보</Title>
      <UserDetails>
        <Subtitle>기본 정보</Subtitle>
        <Row>
          <div>UUID</div>
          <div>{user.uuid}</div>
        </Row>
        <Row>
          <div>아이디</div>
          <div>{user.username}</div>
        </Row>
        <Row>
          <div>가입일</div>
          <div>{user.joined_at}</div>
        </Row>
        <Row>
          <div>이름</div>
          <div>{user.person.full_name}</div>
        </Row>
        <Row>
          <div>전화번호</div>
          <div>{user.person.phone_number}</div>
        </Row>
        <Row>
          <div>이메일</div>
          <div>{user.email}</div>
        </Row>
        <Row>
          <div>생년월일</div>
          <div>{user.person.birth_date}</div>
        </Row>
        <Row>
          <div>성별</div>
          <div>{user.person.gender}</div>
        </Row>
      </UserDetails>
      <Divider />
      <Profiles>
        <Subtitle>프로필 (커뮤니티)</Subtitle>
        {user.profiles.map((profile) => (
          <UserProfile key={profile.nickname} profile={profile} />
        ))}
      </Profiles>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px;
  gap: 36px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;

  > div:last-child {
    border-bottom: none;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  font-size: 18px;

  border-bottom: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};

  > div {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 12px;
  }

  > div:first-child {
    flex: 1;

    border-right: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
  }

  > div:last-child {
    flex: 4;
  }
`;

const Profiles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Subtitle = styled.div`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
`;
