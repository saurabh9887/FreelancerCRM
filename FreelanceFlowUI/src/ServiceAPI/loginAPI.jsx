import { Base_Url } from "../Components/Base_url";
import axios from "axios";

export const login = async (params) => {
  const url = `${Base_Url}/auth/login`;
  const res = await axios.post(url, params);
  return res;
};
