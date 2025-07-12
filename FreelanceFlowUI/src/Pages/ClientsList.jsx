import React, { useEffect, useState, useSyncExternalStore } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import Pagination from "../Components/Pagination";
import AddUpdateClient from "../Components/AddUpdateClient";
import {
  deleteClientByID,
  getAllClientsAPI,
} from "../ServiceAPI/ClientsAPI/ClientsAPI";
import SuccessPopup from "../Components/SuccessPopup";

const ClientsList = () => {
  const [search, setSearch] = useState("");
  const [clientList, setClientList] = useState([]);
  const [openClientModal, setOpenClientModal] = useState();
  const [showSuccessPopUp, setShowSuccessPopUp] = useState(false);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const [totalRecords, setTotalRecords] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    clientKeyID: null,
  });

  console.log(showSuccessPopUp);

  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetAllClientsList(currentPage, null, null, null);
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  const GetAllClientsList = async (pageNo, searchKeyword, fromDate, toDate) => {
    try {
      const res = await getAllClientsAPI({
        pageNo: pageNo ? pageNo : 1,
        pageSize: pageSize,
        searchKeyword: searchKeyword ? searchKeyword : null,
        fromDate: fromDate ? fromDate : null,
        toDate: toDate ? toDate : null,
      });

      if (res) {
        setClientList(res.data.data);
        const pages = res.data.data.length;
        setTotalPages(pages / pageSize);
        setTotalRecords(res.data.total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const filteredClients = clients.filter((client) =>
  //   client.name.toLowerCase().includes(search.toLowerCase())
  // );

  const handleAddClient = () => {
    setOpenClientModal(true);
    setModelRequestData((prev) => ({
      ...prev,
      Action: null,
      clientKeyID: null,
    }));
  };

  const handleUpdateClient = (value) => {
    setOpenClientModal(true);
    setModelRequestData((prev) => ({
      ...prev,
      Action: "Update",
      clientKeyID: value.clientKeyID,
    }));
  };

  const handleDeleteClient = async (value) => {
    // debugger;
    if (!value.clientKeyID) return;

    try {
      const res = await deleteClientByID(value.clientKeyID);
      setSuccessMessage("Client Deleted Successfully!");
      setShowSuccessPopUp(true);
      setIsAddUpdateActionDone(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onPageChange = (value) => {
    setCurrentPage(value);
    GetAllClientsList(value, null, null, null);
  };

  const handleSearch = (e) => {
    const input = e.target.value;
    setSearch(input);
    GetAllClientsList(1, input, null, null);
  };

  return (
    <div
      className="p-6 bg-[#F1F5F9] overflow-y-hidden flex flex-col"
      style={{ height: "calc(100vh - 104px)" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => handleSearch(e)}
          className="px-4 py-2 rounded-lg border border-slate-300 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
          onClick={handleAddClient}
        >
          <FiPlus />
          Add Client
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200">
        <table className="min-w-[800px] max-h-[750px] w-full text-sm text-left text-slate-700">
          <thead className="bg-slate-100 text-slate-900 font-semibold">
            <tr>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                #
              </th>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                Name
              </th>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                Email
              </th>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                Company
              </th>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                Phone Number
              </th>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clientList.map((client, i) => (
              <tr key={i} className="hover:bg-slate-50 transition">
                <td
                  className="px-4 py-3"
                  style={{ border: "1px solid lightgray" }}
                >
                  {(currentPage - 1) * pageSize + i + 1}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ border: "1px solid lightgray" }}
                >
                  {client.clientName}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ border: "1px solid lightgray" }}
                >
                  {client.clientEmail}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ border: "1px solid lightgray" }}
                >
                  {client.clientCompany}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ border: "1px solid lightgray" }}
                >
                  {client.clientMobileNo}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap flex gap-2"
                  style={{ border: "1px solid lightgray" }}
                >
                  <button
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                    onClick={() => handleUpdateClient(client)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                    onClick={() => handleDeleteClient(client)}
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalRecords}
        itemsPerPage={pageSize}
        onPageChange={onPageChange}
      />

      <AddUpdateClient
        show={openClientModal}
        onClose={() => setOpenClientModal(false)}
        modelRequestData={modelRequestData}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        setOpenClientModal={setOpenClientModal}
        setSuccessMessage={setSuccessMessage}
        setShowSuccessPopUp={setShowSuccessPopUp}
      />

      <SuccessPopup
        show={showSuccessPopUp}
        onClose={() => setShowSuccessPopUp(false)}
        message={successMessage}
      />
    </div>
  );
};

export default ClientsList;
