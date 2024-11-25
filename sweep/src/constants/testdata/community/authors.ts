import { AuthorType } from "@models/community";

export const sampleAuthor: AuthorType = {
  profile_image: "https://via.placeholder.com/150",
  color: "#000000",
  nickname: "야구쟁이",
  introduction: "야구를 좋아하는 사람입니다.",
};

export const sampleAuthorNoImage: AuthorType = {
  profile_image: "",
  color: "#000000",
  nickname: "야구쟁이",
  introduction: "야구를 좋아하는 사람입니다.",
};
