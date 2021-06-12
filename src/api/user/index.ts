import axios from "../";
import { User } from "../../types";
import _get from "lodash/get";

const getMyUser = async (id: string) => {
  const response = await axios({
    url: `/user/${id}`,
    method: "GET",
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return _get(response, "data");
};

const getAllUsers = async () => {
  const response = await axios({
    url: `/user`,
    method: "GET",
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

const updateUser = async (user: User) => {
  const id = user._id;
  const response = await axios({
    url: `/user/${id}`,
    method: "PUT",
    data: user,
  });

  return response.data;
};

export { getMyUser, getAllUsers, updateUser };
