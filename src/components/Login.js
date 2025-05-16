import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.usernameOrEmail && formData.password) {
      try {
        const response = await fetch("http://localhost/php-backend/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (result.success && result.user && result.user.id) {
          login(result.user); // Use context login function
        } else {
          setError(result.message || "Login failed.");
        }
      } catch (err) {
        setError("Server error. Please try again.");
      }
    } else {
      setError("Please enter both fields.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      <div className="mt-24 p-10 bg-white/90 rounded-3xl shadow-2xl w-full max-w-lg border border-pink-100">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">
          Login
        </h2>
        <div className="text-center mb-6">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/form" className="text-pink-600 font-semibold hover:underline">
            Register
          </Link>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Username or Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className="w-full p-3 border-2 rounded-xl bg-blue-50 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              placeholder="Enter your username or email"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border-2 rounded-xl bg-blue-50 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
