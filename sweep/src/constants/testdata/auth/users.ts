import { UserProfileType, UserType } from "@models/auth";

export const sampleAuthor: UserProfileType = {
  id: 1,
  profile_image: "https://via.placeholder.com/150",
  color: "#000000",
  name: "홍길동",
  nickname: "야구쟁이",
  introduction: "야구를 좋아하는 사람입니다.",
};

export const sampleAuthorNoImage: UserProfileType = {
  id: 2,
  profile_image: "",
  name: "홍길동",
  color: "#000000",
  nickname: "야구쟁이",
  introduction: "야구를 좋아하는 사람입니다.",
};

export const sampleUser: UserType = {
  uuid: "uuid",
  username: "username",
  email: "email@email.com",
  person: {
    name: "홍길동",
    phone_number: "010-1234-5678",
    birth_date: "1990-01-01",
    gender: "F",
  },
  joined_at: "2021-01-01",
  selected_profile: sampleAuthor,
};
