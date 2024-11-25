import { PersonType, UserType } from "@models/members";

export const samplePeople: PersonType[] = [
  {
    full_name: "John Doe",
    phone_number: "123456",
  },
  {
    full_name: "Jane Doe",
    phone_number: "654321",
  },
];

export const sampleUsers: UserType[] = [
  {
    uuid: "1",
    username: "johndoe",
    email: "john@doe.com",
    joined_at: "2024-11-01",
    person: samplePeople[0],
  },
  {
    uuid: "2",
    username: "janedoe",
    email: "jane@doe.com",
    joined_at: "2024-11-01",
    person: samplePeople[1],
  },
];
