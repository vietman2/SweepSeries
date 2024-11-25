import { PersonType, UserType } from "@models/members";

export const samplePeople: PersonType[] = [
  {
    full_name: "John Doe",
    phone_number: "123456",
    birth_date: "1990-01-01",
    gender: "M",
  },
  {
    full_name: "Jane Doe",
    phone_number: "654321",
    birth_date: "2000-01-01",
    gender: "F",
  },
];

export const sampleUsers: UserType[] = [
  {
    uuid: "1",
    username: "johndoe",
    email: "john@doe.com",
    joined_at: "2024-11-01",
    person: samplePeople[0],
    profiles: [
      {
        profile_image: "https://via.placeholder.com/150",
        color: "#ff0000",
        nickname: "John",
        introduction: "Hello, I'm John.",
      },
      {
        profile_image: "https://via.placeholder.com/150",
        color: "#00ff00",
        nickname: "Doe",
        introduction: "Hello, I'm Doe.",
      },
    ],
  },
  {
    uuid: "2",
    username: "janedoe",
    email: "jane@doe.com",
    joined_at: "2024-11-01",
    person: samplePeople[1],
    profiles: [],
  },
];
