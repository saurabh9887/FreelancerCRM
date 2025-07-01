import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Router } from "react-router";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Components/Layout";
import TasksList from "./Pages/TasksList";
import ClientsList from "./Pages/ClientsList";
import InvoiceList from "./Pages/InvoiceList";
import LoginPage from "./Pages/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/tasks" element={<TasksList />} />
          <Route path="/invoices" element={<InvoiceList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
