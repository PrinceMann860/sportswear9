import React, { useState } from "react";

export default function AuthModal({ isOpen, onClose, mode = "login" }) {
  const [currentPage, setCurrentPage] = useState(mode);
  const [formData, setFormData] = useState({
    fullname: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-[90%] max-w-md border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-black mb-6">
          SPORTSWEAR<span className="text-red-500">9</span>
        </h2>

        {currentPage === "login" && (
          <>
            <h3 className="text-lg font-semibold text-center mb-4">Login</h3>
            <form className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                Login
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <button
                onClick={() => setCurrentPage("signup")}
                className="text-red-500 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </>
        )}

        {currentPage === "signup" && (
          <>
            <h3 className="text-lg font-semibold text-center mb-4">Sign Up</h3>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border rounded-lg p-3 text-gray-600"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />
              <button
                type="button"
                onClick={() => setCurrentPage("otp")}
                className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Continue
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                onClick={() => setCurrentPage("login")}
                className="text-red-500 hover:underline"
              >
                Login
              </button>
            </p>
          </>
        )}

        {currentPage === "otp" && (
          <>
            <h3 className="text-lg font-semibold text-center mb-4">
              Verify OTP
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              An OTP has been sent to your email:{" "}
              <span className="font-medium">{formData.email}</span>
            </p>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className="border rounded-lg p-3 text-center"
              />
              <button className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                Verify & Sign Up
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
