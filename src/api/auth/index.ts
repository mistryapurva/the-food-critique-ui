import axios from "../";
import _get from "lodash/get";
import { UserType } from "../../types";

const loginUser = async (email: string, password: string) => {
  const response = await axios({
    url: "/auth/login",
    method: "POST",
    data: { email, password },
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return _get(response, "data");
};

const signUpUser = async (
  email: string,
  password: string,
  name: string,
  role: UserType
) => {
  const response = await axios({
    url: "/user",
    method: "POST",
    data: { email, password, name, role },
  }).catch((error) => {
    const msg =
      _get(error, "response.data.error") || "An unexpected error occurred";

    throw new Error(msg);
  });

  return response.data;
};

export { loginUser, signUpUser };
