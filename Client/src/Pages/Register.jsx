import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = ({onClose, onSwitchToLogin}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // console.log(onClose);
  

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);

    try {
      const response = await axios.post(
        "https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);

      if (response.data.user.role == "renter") {
        navigate("/welcome-user");
      } else if (response.data.user.role == "provider") {
        navigate("/welcome-renter");
      }
      console.log("Registration Success:", response.data);
    } catch (error) {
      console.error("Error", error.message);
    }
  };

  return (


      <div className="register-slide w-full min-h-screen relative overflow-hidden flex items-center justify-center font-manrope px-4 py-10 bg-black">

        {/* <img
          src="assets/images/register-bg.png"
          className="absolute w-full h-full object-cover -z-10"
          alt="Background"
        /> */}

              <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-xl font-bold hover:text-red-400 transition-all"
      >
        ✕
      </button>

        <div className="w-full max-w-xl bg-transparent  rounded-3xl shadow-lg z-10 p-6 sm:p-8 md:p-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8">
            Register
          </h2>

          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-5 sm:gap-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="" disabled hidden>
                Select your role
              </option>
              <option value="provider" className="text-black">
                I am a Provider
              </option>
              <option value="renter" className="text-black">
                I am a Renter
              </option>
            </select>

            <button
              type="submit"
              className="w-full bg-black text-white border border-white font-bold py-3 rounded-lg hover:bg-white hover:text-black transition-all"
            >
              Register
            </button>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-6">
              <div className="text-white text-center sm:text-left">
                Already have an Account?{" "}
                <a
                  onClick={onSwitchToLogin}
                  className="text-white hover:cursor-pointer hover:text-amber-200 underline"
                >
                  Login
                </a>
              </div>
              <div className="text-white font-manrope font-bold text-2xl text-center sm:text-right">
                CypherShare
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Register;
