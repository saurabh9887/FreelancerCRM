import React, { useContext, useEffect, useState } from "react";
import {
  AddUpdateClientAPI,
  getSingleClientByID,
} from "../ServiceAPI/ClientsAPI/ClientsAPI";
import { GlobalErrorMessage } from "./helper";
import SuccessPopup from "./SuccessPopup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  AddUpdateTasksAPI,
  getSingleTasksByID,
} from "../ServiceAPI/TasksAPI/TasksAPI";
import { TaskStatus } from "../middleware/Utils";
import Select from "react-select";
import { AuthContext } from "../context/authContext";

const AddUpdateTasks = ({
  show,
  onClose,
  modelRequestData,
  setSuccessMessage,
  setOpenTaskModal,
  setIsAddUpdateActionDone,
  setShowSuccessPopUp,
}) => {
  if (!show) return null;

  const [error, setError] = useState(false);
  const { currentUser } = useContext(AuthContext);
  // const [taskData, setTaskData] = useState({
  //   taskKeyID: null,
  //   title: null,
  //   dueDate: null,
  //   status: null,
  //   description: null,
  // });

  const [taskData, setTaskData] = useState({
    taskKeyID: null,
    title: null,
    description: null,
    status: null,
    dueDate: null,
  });

  // const setInitial = () => {
  //   setTaskData((prev) => ({
  //     ...prev,
  //     title: null,
  //     dueDate: null,
  //     status: null,
  //     description: null,
  //   }));
  // };

  useEffect(() => {
    if (
      modelRequestData.taskKeyID !== "" &&
      modelRequestData.taskKeyID !== null &&
      modelRequestData.taskKeyID !== undefined
    ) {
      GetTaskModal(modelRequestData.taskKeyID);
    }
  }, []);

  function formatDateToYMD(dateInput) {
    // If it's a Date object
    if (dateInput instanceof Date && !isNaN(dateInput)) {
      const year = dateInput.getFullYear();
      const month = String(dateInput.getMonth() + 1).padStart(2, "0");
      const day = String(dateInput.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    }

    // If it's an ISO string like 2025-07-03T18:30:00.000Z
    if (typeof dateInput === "string" && dateInput.includes("T")) {
      const date = new Date(dateInput);
      if (!isNaN(date)) {
        return formatDateToYMD(date); // Recursive call to handle Date object logic
      }
    }

    return "";
  }

  const GetTaskModal = async (taskKeyID) => {
    try {
      const res = await getSingleTasksByID(taskKeyID);
      if (res.status === 200) {
        const ModelData = res.data[0];
        setTaskData((prev) => ({
          ...prev,
          title: ModelData.title,
          description: ModelData.description,
          status: ModelData.status,
          dueDate: ModelData.dueDate,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUpdateTask = () => {
    let isValid = false;
    if (
      taskData.title === null ||
      taskData.title === undefined ||
      taskData.title === "" ||
      taskData.description === null ||
      taskData.description === undefined ||
      taskData.description === "" ||
      taskData.dueDate === null ||
      taskData.dueDate === undefined ||
      taskData.dueDate === "" ||
      taskData.status === null ||
      taskData.status === undefined ||
      taskData.status === ""
    ) {
      isValid = true;
      setError(true);
    }

    const api_params = {
      taskKeyID: modelRequestData.taskKeyID,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      dueDate: formatDateToYMD(taskData.dueDate),
      userID: String(currentUser.userID),
      clientID: "5",
    };

    if (!isValid) {
      AddUpdateTaskData(api_params);
    }
  };

  const AddUpdateTaskData = async (params) => {
    try {
      const res = await AddUpdateTasksAPI(params);
      if (res) {
        setSuccessMessage(
          modelRequestData.taskKeyID !== null
            ? "Task Updated Successfully!"
            : "Task Added Successfully!"
        );
        setShowSuccessPopUp(true);
        setOpenTaskModal(false);
        setIsAddUpdateActionDone(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSelectStatus = (value) => {
    setTaskData((prev) => ({
      ...prev,
      status: value.value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 relative mx-4">
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            setInitial();
          }}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
        >
          &times;
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">
            {modelRequestData.Action === null ? "Add Task" : "Update Task"}
          </h2>
        </div>

        {/* Body */}
        <div className="text-gray-700 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Task */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={taskData?.title}
                placeholder="Task Title"
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                  let input = e.target.value;

                  // Remove leading spaces
                  if (input.startsWith(" ")) {
                    input = input.trimStart();
                  }

                  // Remove all digits
                  input = input.replace(/\d/g, "");

                  // Use the cleaned input as needed (e.g., update state)
                  setTaskData((prev) => ({
                    ...prev,
                    title: input,
                  }));
                }}
              />
              {error &&
              (taskData.title !== null ||
                taskData.title !== undefined ||
                taskData.title !== "") ? (
                <span className="text-red-500">{GlobalErrorMessage}</span>
              ) : (
                ""
              )}
            </div>

            {/* Due Date */}
            <div style={{ width: "100%" }}>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Due Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={taskData.dueDate}
                onChange={(date) => {
                  setTaskData((prev) => ({
                    ...prev,
                    dueDate: date,
                  }));
                }}
                dateFormat="dd/MM/yyyy"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                // className="border rounded px-3 py-2"
              />
              {error &&
              (taskData.dueDate !== null ||
                taskData.dueDate !== undefined ||
                taskData.dueDate !== "") ? (
                <span className="text-red-500">{GlobalErrorMessage}</span>
              ) : (
                ""
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <Select
                value={TaskStatus.find(
                  (item) => item.value === taskData.status
                )}
                options={TaskStatus}
                onChange={handleSelectStatus}
              />
              {error &&
              (taskData.status !== null ||
                taskData.status !== undefined ||
                taskData.status !== "") ? (
                <span className="text-red-500">{GlobalErrorMessage}</span>
              ) : (
                ""
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                type="text"
                value={taskData?.description}
                id="description"
                name="description"
                placeholder="Enter Description"
                required
                maxLength={250}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                  let input = e.target.value;

                  // Remove leading spaces
                  if (input.startsWith(" ")) {
                    input = input.trimStart();
                  }

                  // Use the cleaned input as needed (e.g., update state)
                  setTaskData((prev) => ({
                    ...prev,
                    description: input,
                  }));
                }}
              />
              {error &&
              (taskData.description !== null ||
                taskData.description !== undefined ||
                taskData.description !== "") ? (
                <span className="text-red-500">{GlobalErrorMessage}</span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleAddUpdateTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            {modelRequestData.Action === null ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUpdateTasks;
