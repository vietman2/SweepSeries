import styled from "styled-components";

import { ProfileIcon } from "@components/Icons";
import { UserProfileType } from "@models/members";

interface Props {
  profile: UserProfileType;
}

export function UserProfile({ profile }: Readonly<Props>) {
  return (
    <Container>
      {profile.profile_image ? (
        <img src={profile.profile_image} alt="profile" />
      ) : (
        <IconWrapper>
          <ProfileIcon size={32} color={profile.color} />
        </IconWrapper>
      )}
      <span>{profile.nickname}</span>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  font-size: 18px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.background100};
`;
