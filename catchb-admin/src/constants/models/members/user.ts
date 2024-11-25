export type PersonType = {
  full_name: string;
  phone_number: string;
  birth_date: string;
  gender: string;
};

export type UserType = {
  uuid: string;
  username: string;
  email: string;
  joined_at: string;
  person: PersonType;
};
