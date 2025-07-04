import { Base_Url } from "../../Components/Base_url";
import axios from "axios";

export const getAllClientsAPI = async (params) => {
  const url = `${Base_Url}/client/getAllClients`;
  const res = await axios.post(url, params);

  return res;
};
