import { Base_Url } from "../../Components/Base_url";
import axios from "axios";

export const getAllTasksAPI = async (params) => {
  const url = `${Base_Url}/task/getAllTasks`;
  const res = await axios.post(url, params);

  return res;
};

export const AddUpdateTasksAPI = async (params) => {
  const url = `${Base_Url}/task/AddUpdateTask`;
  const res = await axios.post(url, params);

  return res;
};

export const getSingleTasksByID = async (taskKeyID) => {
  const url = `${Base_Url}/task/getSingleTaskByID?taskKeyID=${taskKeyID}`;
  const res = await axios.get(url);

  return res;
};
