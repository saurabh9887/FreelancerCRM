import { Base_Url } from "../../Components/Base_url";
import axios from "axios";

export const getAllClientsAPI = async (params) => {
  const url = `${Base_Url}/client/getAllClients`;
  const res = await axios.post(url, params);

  return res;
};

export const AddUpdateClientAPI = async (params) => {
  const url = `${Base_Url}/client/AddUpdateClient`;
  const res = await axios.post(url, params);

  return res;
};

export const getSingleClientByID = async (clientKeyID) => {
  const url = `${Base_Url}/client/getSingleClientByID?clientKeyID=${clientKeyID}`;
  const res = await axios.get(url);

  return res;
};

export const deleteClientByID = async (clientKeyID) => {
  const url = `${Base_Url}/client/deleteClientByID?clientKeyID=${clientKeyID}`;
  const res = await axios.delete(url);

  return res;
};
