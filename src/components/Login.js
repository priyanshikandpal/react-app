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
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="mt-16 p-8 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="text-center mb-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/form" className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1">Username or Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
              placeholder="Enter your username or email"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
