import { useState } from "react";
import { useAdminContext } from "../context/AdminContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router";

export default function Login() {
  const [role, setRole] = useState<"admin" | "doctor">("admin");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { setToken, backendUrl ,setAdmin,connectSockets} = useAdminContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const endpoint = role === "admin" 
        ? "/api/v1/admin/login" 
        : "/api/v1/doctor/login";

      const { data } = await axios.post(`${backendUrl}${endpoint}`, {
        email,
        password,
      });

      if (data.status === "success") {
        setToken(data.token);
        setAdmin(data.data);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        localStorage.setItem("authToken", `Bearer ${data.token}`);
        toast.success("Login successful!");

        // Connect socket after successful login
        if (data.data) {
          connectSockets(data.data);
        }

        if(role === 'admin'){
          navigate('/admin/content');
        } else {
          navigate(`/doctor/content`);
        }
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Role toggle */}
      <div className="flex border border-blue-500 rounded-full overflow-hidden mb-6">
        <button
          type="button"
          className={`px-6 py-2 font-semibold focus:outline-none transition-colors duration-200 ${
            role === "admin" ? "bg-blue-500 text-white" : "bg-white text-blue-500"
          }`}
          onClick={() => setRole("admin")}
        >
          Admin
        </button>
        <button
          type="button"
          className={`px-6 py-2 font-semibold focus:outline-none transition-colors duration-200 ${
            role === "doctor" ? "bg-blue-500 text-white" : "bg-white text-blue-500"
          }`}
          onClick={() => setRole("doctor")}
        >
          Doctor
        </button>
      </div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {role.charAt(0).toUpperCase() + role.slice(1)} Login
        </h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}