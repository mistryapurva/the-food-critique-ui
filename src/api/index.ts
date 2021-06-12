import axios, { AxiosError } from "axios";
import _get from "lodash/get";

const instance = axios.create();

export const initAxios = (token: string, logoutCb: Function) => {
  instance.defaults.baseURL = "https://the-food-critique-api.herokuapp.com/";
  instance.defaults.headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  instance.interceptors.response.use(undefined, (error: any) => {
    const status = _get(error, "response.status");

    if (status === 401) {
      logoutCb();
    }

    return Promise.reject(error);
  });
};

export default instance;
