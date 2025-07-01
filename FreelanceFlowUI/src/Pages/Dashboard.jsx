import React from "react";
import { useContext } from "react";
import {
  FiUsers,
  FiDollarSign,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";
import { AuthContext } from "../context/authContext";

const cards = [
  {
    title: "Total Users",
    value: "2,438",
    icon: <FiUsers className="text-indigo-600 text-3xl" />,
  },
  {
    title: "Monthly Revenue",
    value: "$18,250",
    icon: <FiDollarSign className="text-emerald-500 text-3xl" />,
  },
  {
    title: "Paid Invoices",
    value: "1,280",
    icon: <FiCheckCircle className="text-emerald-500 text-3xl" />,
  },
  {
    title: "Growth Rate",
    value: "12.5%",
    icon: <FiTrendingUp className="text-indigo-600 text-3xl" />,
  },
  {
    title: "Total Clients",
    value: "2,438",
    icon: <FiUsers className="text-indigo-600 text-3xl" />,
  },
];

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-[#F1F5F9] p-6 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition"
        >
          <div>
            <h4 className="text-slate-900 font-semibold text-base mb-1">
              {card.title}
            </h4>
            <p className="text-xl font-bold text-slate-900">{card.value}</p>
          </div>
          <div className="bg-white p-3 rounded-full shadow-inner">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
