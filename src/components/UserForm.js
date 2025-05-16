import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const initialFormData = {
  name: "",
  username: "",
  email: "",
  password: "",
};

const initialErrors = {
  name: "",
  username: "",
  email: "",
  password: "",
};

function validate(formData) {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!formData.username.trim()) {
    errors.username = "Username is required";
  } else if (!/^[a-zA-Z0-9_]{4,16}$/.test(formData.username)) {
    errors.username = "Username must be 4-16 characters, letters/numbers/underscores only";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(formData.password)
  ) {
    errors.password =
      "Password must be 8+ chars, include upper/lowercase, a digit, and a special character";
  }

  return errors;
}

function UserForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors(validate({ ...formData, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors(validate(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({
      name: true,
      username: true,
      email: true,
      password: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://localhost/php-backend/submit_form.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        alert(result.message);
        setFormData(initialFormData);
        setTouched({});
        navigate("/login");
      } catch (error) {
        alert("Submission failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      <div className="mt-20 p-10 bg-white/90 rounded-3xl shadow-2xl w-full max-w-lg border border-pink-100">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">
          User Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border-2 rounded-xl bg-blue-50 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition ${
                errors.name && touched.name ? "border-red-500" : "border-blue-200"
              }`}
              placeholder="Enter your name"
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          {/* Username */}
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border-2 rounded-xl bg-blue-50 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition ${
                errors.username && touched.username ? "border-red-500" : "border-blue-200"
              }`}
              placeholder="Choose a username"
            />
            {errors.username && touched.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border-2 rounded-xl bg-blue-50 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition ${
                errors.email && touched.email ? "border-red-500" : "border-blue-200"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          {/* Password */}
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border-2 rounded-xl bg-blue-50 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition ${
                errors.password && touched.password ? "border-red-500" : "border-blue-200"
              }`}
              placeholder="Create a strong password"
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Submit
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already a user? </span>
          <Link to="/login" className="text-pink-600 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
