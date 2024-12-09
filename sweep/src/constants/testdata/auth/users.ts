import { UserProfileType } from "@models/auth";

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
