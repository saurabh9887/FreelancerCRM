import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Pagination from "../Components/Pagination";
import AddUpdateClient from "../Components/AddUpdateClient";

const clients = [
  { name: "John Doe", email: "john@example.com", company: "Acme Corp" },
  { name: "Jane Smith", email: "jane@example.com", company: "Globex Inc" },
  { name: "Jane Smith", email: "jane@example.com", company: "Globex Inc" },
  { name: "Jane Smith", email: "jane@example.com", company: "Globex Inc" },
  { name: "Jane Smith", email: "jane@example.com", company: "Globex Inc" },
  { name: "Jane Smith", email: "jane@example.com", company: "Globex Inc" },
  { name: "Jane Smith", email: "jane@example.com", company: "Globex Inc" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  { name: "Bob Johnson", email: "bob@example.com", company: "Soylent Ltd" },
  // Add more mock clients here
];

const ClientsList = () => {
  const [search, setSearch] = useState("");
  const [openClientModal, setOpenClientModal] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    clientKeyID: null,
  });

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClient = () => {
    setOpenClientModal(true);
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
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={handleAddClient}
        >
          <FiPlus />
          Add Client
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200">
        <table className="min-w-[800px] w-full text-sm text-left text-slate-700">
          <thead className="bg-slate-100 text-slate-900 font-semibold">
            <tr>
              <th
                className="px-4 py-3 whitespace-nowrap"
                style={{ border: "1px solid lightgray" }}
              >
                #
              </th>
              {Array.from({ length: 12 }).map((_, index) => (
                <th
                  key={index}
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ border: "1px solid lightgray" }}
                >
                  Table heading
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition">
                <td
                  className="px-4 py-3"
                  style={{ border: "1px solid lightgray" }}
                >
                  {i + 1}
                </td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td
                    key={index}
                    className="px-4 py-3 whitespace-nowrap"
                    style={{ border: "1px solid lightgray" }}
                  >
                    Table cell {index}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination />

      <AddUpdateClient
        show={openClientModal}
        onClose={() => setOpenClientModal(false)}
        modelRequestData={modelRequestData}
      />
    </div>
  );
};

export default ClientsList;
