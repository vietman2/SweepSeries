export type PersonType = {
  full_name: string;
  phone_number: string;
  birth_date: string;
  gender: string;
};

export type UserProfileType = {
  profile_image: string;
  color: string;
  nickname: string;
  introduction: string;
}

export type UserType = {
  uuid: string;
  username: string;
  email: string;
  joined_at: string;
  person: PersonType;
  profiles: UserProfileType[];
};
