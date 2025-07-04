import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Globe from "../Components/ui/Globe";

const Login = ({ onClose, onRegisterClick }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);

    try {
      const response = await axios.post(
        "https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("Login Success:", response.data.user);

      toast.success("✅Login Successfull", {
        className:
          "!bg-[#0f0f0f] !text-[#e6ffe6] !border-l-4 !border-[#00ff88] !shadow-lg !shadow-green-500/30 !rounded-md !px-6 !py-4 !font-orbitron !tracking-wider",
        bodyClassName: "!text-sm !uppercase",
        progressClassName: "!bg-[#00ff88]",
        closeButton: false,
        icon: false,
        theme: "dark",
      });

      setTimeout(() => {
        if (response.data.user.role === "renter") {
          navigate("/welcome-user");
        } else if (response.data.user.role === "provider") {
          navigate("/welcome-renter");
        }
      }, 4000);
    } catch (error) {
      const errMsg = error.response?.data?.msg || "Something went wrong!";
      toast.error(errMsg, {
        className:
          "bg-[#0f0f0f] text-[#fefefe] border-l-4 border-[#ff1f1f] shadow-lg shadow-red-500/30 rounded-md px-6 py-4 !font-orbitron tracking-wider ",
        progressClassName: "!bg-[#ff1f1f]",
        closeButton: false,
        icon: false,
        theme: "dark",
      });
      console.error("Login error:", errMsg);
    }
  };

  return (
    <div className="login-slide bg-black">
      <div className="w-full min-h-screen font-manrope bg-black flex items-center justify-center px-4 md:px-[14%] relative overflow-hidden ">
        <button
          className="font-orbitron absolute top-6 right-6 text-white text-3xl z-50 hover:text-red-400"
          onClick={onClose}
        >
          ✖
        </button>
        {/* <img
        src="assets/images/login-bg.png"
        className="absolute w-full h-full object-cover z-0"
        alt="Background"
      /> */}
        {/* <Globe className="absolute" /> */}

        {/* <div className="relative z-10 w-full max-w-6xl min-h-[600px] lg:min-h-[750px] flex flex-col lg:flex-row bg-transparent border-4 border-white rounded-[20px] overflow-hidden p-6 md:p-10 items-center justify-center"> */}
        <div className=" w-full lg:w-1/2 h-full bg-black flex flex-col items-center justify-center px-4 sm:px-8 lg:px-10 py-8">
          <h2 className="font-orbitron text-[40px] sm:text-[60px] lg:text-[90px] font-semibold mb-8 text-white text-center">
            Login
          </h2>
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm flex flex-col gap-6 sm:gap-8 items-center justify-center"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 bg-transparent focus:ring-[#948979] text-white border-white placeholder-white focus:border-0 font-orbitron"
              autoComplete="username"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#948979] text-white bg-transparent border-white placeholder-white focus:border-0 font-orbitron"
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="font-orbitron w-[80%] bg-black text-white border border-white font-semibold py-3 rounded-lg hover:bg-white hover:text-[#7b6042] transition-all"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-white flex items-center justify-center">
            Don’t have an account?{" "}
            <a
              onClick={onRegisterClick}
              className="text-white hover:cursor-pointer hover:text-amber-200 underline"
            >
              Register
            </a>
          </div>
        </div>

        {/* <div className="w-full lg:w-1/2 h-full bg-transparent flex items-center justify-center py-8"></div> */}
        {/* </div> */}
        <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
      </div>
    </div>
  );
};

export default Login;
