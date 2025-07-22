import React, {
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import Pagination from "../Components/Pagination";
import AddUpdateClient from "../Components/AddUpdateClient";
import {
  deleteClientByID,
  getAllClientsAPI,
} from "../ServiceAPI/ClientsAPI/ClientsAPI";
import SuccessPopup from "../Components/SuccessPopup";
import AddUpdateTasks from "../Components/AddUpdateTasks";
import { getAllTasksAPI } from "../ServiceAPI/TasksAPI/TasksAPI";
import { TaskStatus } from "../middleware/Utils";
import { AuthContext } from "../context/authContext";

const TasksList = () => {
  const [search, setSearch] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState();
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
    taskKeyID: null,
  });

  const { currentUser } = useContext(AuthContext);

  console.log(showSuccessPopUp);

  useEffect(() => {
    if (isAddUpdateActionDone) {
      GetAllTasksList(currentPage, null, null, null);
    }
    setIsAddUpdateActionDone(false);
  }, [isAddUpdateActionDone]);

  const GetAllTasksList = async (pageNo, searchKeyword, fromDate, toDate) => {
    try {
      const res = await getAllTasksAPI({
        pageNo: pageNo ? pageNo : 1,
        pageSize: pageSize,
        searchKeyword: searchKeyword ? searchKeyword : null,
        fromDate: fromDate ? fromDate : null,
        toDate: toDate ? toDate : null,
        userID: String(currentUser.userID),
      });

      if (res) {
        setTaskList(res.data.data);
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

  const handleAddTask = () => {
    setOpenTaskModal(true);
    setModelRequestData((prev) => ({
      ...prev,
      Action: null,
      taskKeyID: null,
    }));
  };

  const handleUpdateTask = (value) => {
    setOpenTaskModal(true);
    setModelRequestData((prev) => ({
      ...prev,
      Action: "Update",
      taskKeyID: value.taskKeyID,
    }));
  };

  const onPageChange = (value) => {
    setCurrentPage(value);
    GetAllTasksList(value, null, null, null);
  };

  const handleSearch = (e) => {
    const input = e.target.value;
    setSearch(input);
    GetAllTasksList(1, input, null, null);
  };

  function extractDateOnly(isoString) {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`; // or use "/" instead of "-"
    } catch (error) {
      console.error("Invalid date string:", isoString);
      return "";
    }
  }

  return (
    <div
      className="p-6 bg-[#F1F5F9] overflow-y-hidden flex flex-col"
      style={{ height: "calc(100vh - 104px)" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => handleSearch(e)}
          className="px-4 py-2 rounded-lg border border-slate-300 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
          onClick={handleAddTask}
        >
          <FiPlus />
          Add Task
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
                Sr No
              </th>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                Task Title
              </th>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                Description
              </th>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                Due Date
              </th>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                Status
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
            {taskList.map((task, i) => (
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
                  {task.title}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ border: "1px solid lightgray" }}
                >
                  {task.description
                    ? task.description.length > 20
                      ? task.description.slice(0, 20) + "...."
                      : task.description
                    : ""}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ border: "1px solid lightgray" }}
                >
                  {extractDateOnly(task.dueDate)}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ border: "1px solid lightgray" }}
                >
                  {TaskStatus.find((id) => id.value === task.status).label}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap flex gap-2"
                  style={{ border: "1px solid lightgray" }}
                >
                  <button
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                    onClick={() => handleUpdateTask(task)}
                  >
                    <FiEdit />
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

      <AddUpdateTasks
        show={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        modelRequestData={modelRequestData}
        setIsAddUpdateActionDone={setIsAddUpdateActionDone}
        setOpenTaskModal={setOpenTaskModal}
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

export default TasksList;
