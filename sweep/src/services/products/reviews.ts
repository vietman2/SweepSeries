import axios from "axios";
import FormData from "form-data";
import { ImagePickerAsset } from "expo-image-picker";

import { ReviewInputType } from "@models/products";

export async function getReviews() {
  try {
    const response = await axios.get("/v1/reviews/");
    return response.data;
  } catch {
    return null;
  }
}

export async function getTagOptions() {
  try {
    const response = await axios.get("/v1/reviews/tags/");
    return response.data;
  } catch {
    return null;
  }
}

export async function createReview(
  sessionId: string,
  lessonReview: ReviewInputType,
  coachReview: ReviewInputType,
  academyReview: ReviewInputType
) {
  if (
    lessonReview.rating === 0 ||
    coachReview.rating === 0 ||
    academyReview.rating === 0
  ) {
    return {
      status: 400,
      data: {
        error: "평점을 모두 선택해주세요.",
      },
    };
  }

  if (
    lessonReview.tagIds.length === 0 ||
    coachReview.tagIds.length === 0 ||
    academyReview.tagIds.length === 0
  ) {
    return {
      status: 400,
      data: {
        error: "리뷰 키워드를 최소 1개씩 선택해주세요.",
      },
    };
  }

  if (
    lessonReview.comment.length < 10 ||
    lessonReview.comment.length > 500 ||
    coachReview.comment.length < 10 ||
    coachReview.comment.length > 500 ||
    academyReview.comment.length < 10 ||
    academyReview.comment.length > 500
  ) {
    return {
      status: 400,
      data: {
        error: "후기는 10자 이상, 500자 이하로 작성해주세요.",
      },
    };
  }

  try {
    const form = new FormData();
    form.append("session_id", sessionId.split("s")[1]);
    
    const { images: lessonImages, ...lessonReviewData } = lessonReview;
    const { images: coachImages, ...coachReviewData } = coachReview;
    const { images: academyImages, ...academyReviewData } = academyReview;

    form.append("lesson_review", JSON.stringify(lessonReviewData));
    form.append("coach_review", JSON.stringify(coachReviewData));
    form.append("academy_review", JSON.stringify(academyReviewData));

    lessonImages.forEach((image: ImagePickerAsset) => {
      form.append("lesson_images", {
        uri: image.uri,
        name: image.uri.split("/").pop(),
        type: "image/jpeg",
      });
    });
    coachImages.forEach((image: ImagePickerAsset) => {
      form.append("coach_images", {
        uri: image.uri,
        name: image.uri.split("/").pop(),
        type: "image/jpeg",
      });
    });
    academyImages.forEach((image: ImagePickerAsset) => {
      form.append("academy_images", {
        uri: image.uri,
        name: image.uri.split("/").pop(),
        type: "image/jpeg",
      });
    });

    const response = await axios.post(`/v1/reviews/`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      status: response.status,
      data: response.data
    };
  } catch {
    return {
      status: 400,
      data: {
        error: "오류가 발생했습니다. 다시 시도해주세요.",
      },
    };
  }
}

export async function getAcademyReviews(uuid: string) {
  try {
    const response = await axios.get(`/v1/academies/${uuid}/reviews/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function getCoachReviews(uuid: string) {
  try {
    const response = await axios.get(`/v1/coaches/${uuid}/reviews/`);

    return response.data;
  } catch {
    return null;
  }
}
