import axios from "../";
import { Review, ReviewComment } from "../../types";
import _get from "lodash/get";

const addReview = async (review: Review) => {
  const response = await axios({
    url: "/review",
    method: "POST",
    data: review,
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

const addCommentToReview = async (reviewId: string, comment: ReviewComment) => {
  const response = await axios({
    url: `/review/${reviewId}/comment`,
    method: "POST",
    data: comment,
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

const getReviews = async (skip: number = 0) => {
  const response = await axios({
    url: `/review?skip=${skip}`,
    method: "GET",
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

const updateReview = async (review: Review) => {
  const id = review._id;
  const response = await axios({
    url: `/review/${id}`,
    method: "PUT",
    data: review,
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

export { addReview, addCommentToReview, getReviews, updateReview };
