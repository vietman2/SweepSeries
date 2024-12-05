import axios from "axios";

export async function getFAQs(category: string) {
  try {
    const response = await axios.get("/v1/faqs/", {
      params: {
        category,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getFAQ(faqId: string | undefined) {
  if (!faqId) return null;

  try {
    const response = await axios.get(`/v1/faqs/${faqId}/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function createFAQ(
  category: string,
  question: string,
  answer: string
) {
  try {
    const response = await axios.post("/v1/faqs/", {
      category,
      question,
      answer,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function updateFAQ(
  faqId: string | undefined,
  question: string,
  answer: string
) {
  if (!faqId) return null;

  try {
    const response = await axios.put(`/v1/faqs/${faqId}/`, {
      question,
      answer,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function deleteFAQ(faqId: string | undefined) {
  if (!faqId) return null;

  try {
    await axios.delete(`/v1/faqs/${faqId}/`);

    return true;
  } catch {
    return null;
  }
}
