import React, { useState } from "react";
import { GlobalErrorMessage } from "../Components/helper";
import { login } from "../ServiceAPI/loginAPI";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";
import { roleType } from "../middleware/Utils";
import { useEffect } from "react";

const LoginPage = () => {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthnticated, setIsAuthnticated, currentUser, setCurrentUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "freelancer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = false;
    if (
      formData.email === null ||
      formData.email === undefined ||
      formData.email === "" ||
      formData.password === null ||
      formData.password === undefined ||
      formData.password === "" ||
      formData.role === null ||
      formData.role === undefined ||
      formData.role === ""
    ) {
      setError(true);
      isValid = true;
    }
    const api_params = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };
    if (!isValid) {
      LoginApi(api_params);
    }
  };

  const LoginApi = async (parmas) => {
    try {
      const res = await login(parmas);
      if (res.status === 200) {
        setCurrentUser(res.data);
        setIsAuthnticated(true);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-[#0F172A] mb-6 text-center">
          Login to FreelanceFlow
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#0F172A] mb-1"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="you@example.com"
            />
            {error &&
            (formData.email === null ||
              formData.email === undefined ||
              formData.email === "") ? (
              <span className="text-red-700">{GlobalErrorMessage}</span>
            ) : (
              ""
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#0F172A] mb-1"
            >
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="••••••••"
            />
            <div
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </div>

            {error && (!formData.email || formData.email === "") ? (
              <span className="text-red-700">{GlobalErrorMessage}</span>
            ) : null}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-[#0F172A] mb-1"
            >
              Role
            </label>
            <Select
              value={roleType.find((item) => item.value === formData.role)}
              options={roleType}
              onChange={handleRoleChange}
            />
            {/* <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select> */}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#4F46E5] text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Forgot password?{" "}
          <a href="#" className="text-[#4F46E5] hover:underline">
            Reset here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
