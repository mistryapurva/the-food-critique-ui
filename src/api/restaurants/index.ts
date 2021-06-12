import _find from "lodash/find";
import _get from "lodash/get";
import axios from "../";
import { RatingFilterEnum, Restaurant } from "../../types";

const getRestaurants = async ({
  rating,
  skip,
  search,
}: {
  rating?: RatingFilterEnum;
  skip?: number;
  search?: string;
}) => {
  const response = await axios({
    url: `/restaurant?rating=${rating}&skip=${skip}&search=${search || ""}`,
    method: "GET",
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

const getRestaurant = async (id: string) => {
  const response = await axios({
    url: `/restaurant/${id}`,
    method: "GET",
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

const createRestaurant = async (restaurant: Restaurant) => {
  const response = await axios({
    url: "/restaurant",
    method: "POST",
    data: restaurant,
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

const updateRestaurant = async (restaurant: Restaurant) => {
  const id = restaurant._id;
  const response = await axios({
    url: `/restaurant/${id}`,
    method: "PUT",
    data: restaurant,
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

export { getRestaurants, getRestaurant, createRestaurant, updateRestaurant };
