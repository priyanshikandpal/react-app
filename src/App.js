import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import UserForm from "./components/UserForm";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";

//PrivateRoute component for protected routes
import PrivateRoute from "./components/PrivateRoute"; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <nav className="mb-4">
            <Link to="/" className="text-blue-600 font-semibold mx-2">Home</Link>
            |
            <Link to="/form" className="text-blue-600 font-semibold mx-2">User Form</Link>
            |
            <Link to="/login" className="text-blue-600 font-semibold mx-2">Login</Link>
          </nav>
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/form" element={<UserForm />} />
              <Route path="/login" element={<Login />} />
              {/* Protect Dashboard route */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
