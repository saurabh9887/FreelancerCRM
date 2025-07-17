import React, { useEffect, useState } from "react";
import {
  AddUpdateClientAPI,
  getSingleClientByID,
} from "../ServiceAPI/ClientsAPI/ClientsAPI";
import { GlobalErrorMessage } from "./helper";
import SuccessPopup from "./SuccessPopup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddUpdateTasks = ({
  show,
  onClose,
  modelRequestData,
  setSuccessMessage,
  setOpenClientModal,
  setIsAddUpdateActionDone,
  setShowSuccessPopUp,
}) => {
  if (!show) return null;

  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(null);
  // const [taskData, setTaskData] = useState({
  //   taskKeyID: null,
  //   title: null,
  //   dueDate: null,
  //   status: null,
  //   description: null,
  // });

  const [clientData, setClientData] = useState({
    clientKeyID: null,
    clientName: null,
    clientEmail: null,
    clientMobileNo: null,
    clientCompany: null,
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
      modelRequestData.clientKeyID !== "" &&
      modelRequestData.clientKeyID !== null &&
      modelRequestData.clientKeyID !== undefined
    ) {
      GetClientModal(modelRequestData.clientKeyID);
    }
  }, []);

  const GetClientModal = async (clientKeyID) => {
    // debugger;
    try {
      const res = await getSingleClientByID(clientKeyID);
      if (res.status === 200) {
        const ModelData = res.data[0];
        setClientData((prev) => ({
          ...prev,
          clientName: ModelData.clientName,
          clientEmail: ModelData.clientEmail,
          clientCompany: ModelData.clientCompany,
          clientMobileNo: ModelData.clientMobileNo,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUpdateClient = () => {
    // debugger;
    let isValid = false;
    if (
      clientData.clientName === null ||
      clientData.clientName === undefined ||
      clientData.clientName === "" ||
      clientData.clientEmail === null ||
      clientData.clientEmail === undefined ||
      clientData.clientEmail === "" ||
      clientData.clientCompany === null ||
      clientData.clientCompany === undefined ||
      clientData.clientCompany === "" ||
      clientData.clientMobileNo === null ||
      clientData.clientMobileNo === undefined ||
      clientData.clientMobileNo === ""
    ) {
      isValid = true;
      setError(true);
    } else if (
      clientData.clientEmail &&
      !isValidEmail(clientData.clientEmail)
    ) {
      isValid = true;
      setError(true);
    }

    const api_params = {
      clientKeyID: modelRequestData.clientKeyID,
      clientName: clientData.clientName,
      clientEmail: clientData.clientEmail,
      clientMobileNo: clientData.clientMobileNo,
      clientCompany: clientData.clientCompany,
    };

    if (!isValid) {
      AddUpdateClientData(api_params);
    }
  };

  const AddUpdateClientData = async (params) => {
    // debugger;
    try {
      const res = await AddUpdateClientAPI(params);
      if (res) {
        setSuccessMessage(
          modelRequestData.clientKeyID !== null
            ? "Client Updated Successfully!"
            : "Client Added Successfully!"
        );
        setShowSuccessPopUp(true);
        setOpenClientModal(false);
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
                value={clientData?.clientName}
                placeholder="Client Name"
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
                  setClientData((prev) => ({
                    ...prev,
                    clientName: input,
                  }));
                }}
              />
              {error &&
              (clientData.clientName !== null ||
                clientData.clientName !== undefined ||
                clientData.clientName !== "") ? (
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
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                // className="border rounded px-3 py-2"
              />
              {error &&
              (clientData.clientCompany !== null ||
                clientData.clientCompany !== undefined ||
                clientData.clientCompany !== "") ? (
                <span className="text-red-500">{GlobalErrorMessage}</span>
              ) : (
                ""
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientData?.clientMobileNo}
                id="phone"
                name="phone"
                maxLength={10}
                placeholder="Enter Phone Number"
                pattern="[0-9]*"
                inputMode="numeric"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                  let input = e.target.value;

                  // Remove spaces
                  input = input.trim();

                  // Allow only digits
                  input = input.replace(/\D/g, "");

                  // Disallow leading zeros
                  if (input.startsWith("0")) {
                    input = input.replace(/^0+/, "");
                  }

                  // Limit to 10 digits
                  if (input.length > 10) {
                    input = input.slice(0, 10);
                  }

                  setClientData((prev) => ({
                    ...prev,
                    clientMobileNo: input,
                  }));
                }}
              />
              {error &&
              (clientData.clientMobileNo !== null ||
                clientData.clientMobileNo !== undefined ||
                clientData.clientMobileNo !== "") ? (
                <span className="text-red-500">{GlobalErrorMessage}</span>
              ) : (
                ""
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                type="email"
                value={clientData?.clientEmail}
                id="email"
                name="email"
                placeholder="Enter Email"
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
                  setClientData((prev) => ({
                    ...prev,
                    clientEmail: input,
                  }));
                }}
              />
              {error &&
              (clientData.clientEmail !== null ||
                clientData.clientEmail !== undefined ||
                clientData.clientEmail !== "") ? (
                <span className="text-red-500">{GlobalErrorMessage}</span>
              ) : clientData.clientEmail &&
                !isValidEmail(clientData.clientEmail) ? (
                <span className="text-red-500">
                  Please enter a valid email address
                </span>
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
            onClick={handleAddUpdateClient}
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
