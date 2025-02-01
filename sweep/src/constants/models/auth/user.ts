export type UserProfileType = {
  id: number;
  profile_image: string;
  color: string;
  name: string;
  nickname: string;
  introduction: string;
};

type PersonType = {
  name: string;
  phone_number: string;
  birth_date: string;
  gender: string;
}

export type UserType = {
  uuid: string;
  username: string;
  email: string;
  person: PersonType;
  joined_at: string;
  selected_profile: UserProfileType;
}
