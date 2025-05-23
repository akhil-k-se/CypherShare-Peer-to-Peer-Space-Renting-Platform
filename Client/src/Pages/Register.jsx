import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registration Data:', formData);
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex items-center justify-center font-manrope px-4 py-10">

      <img
        src="assets/images/register-bg.png"
        className="absolute w-full h-full object-cover -z-10"
        alt="Background"
      />


      <div className="w-full max-w-xl bg-[#c29c6b] border-4 border-white rounded-3xl shadow-lg z-10 p-6 sm:p-8 md:p-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8">
          Register
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-5 sm:gap-6">

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
            className="w-full bg-white text-[#c29c6b] font-bold py-3 rounded-lg hover:bg-[#d5b185] hover:text-white transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;