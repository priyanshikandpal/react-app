import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create the context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On mount, check if userId exists in localStorage and set user accordingly
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else if (userId) {
      setUser({ id: userId });
    }
  }, []);

  // Login function: set user and save to localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    navigate("/dashboard");
  };

  // Logout function: clear user and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Update user info and persist to localStorage
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("userInfo", JSON.stringify(newUserData));
    if (newUserData.id) {
      localStorage.setItem("userId", newUserData.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export function useAuth() {
  return useContext(AuthContext);
}
