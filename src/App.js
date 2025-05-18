import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import UserForm from "./components/UserForm";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import 'react-quill/dist/quill.snow.css';
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Request notification permission on initial load
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  // Memoize the checkReminders function so it can be a dependency safely
  const checkReminders = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost/php-backend/get_reminders.php?user_id=${user.id}`
      );
      const { data: reminders } = await response.json();

      const now = new Date();
      reminders.forEach(async (reminder) => {
        const remindTime = new Date(reminder.remind_at);
        if (remindTime <= now && reminder.status === 'pending') {
          // Show notification
          if (notificationPermission === 'granted') {
            new Notification(`Reminder: ${reminder.note_title}`, {
              body: reminder.message || "You have a pending note!",
              // icon: '/path-to-your-logo.png' // Optional: add your logo path
            });
          }

          // Mark reminder as done
          await fetch("http://localhost/php-backend/mark_reminder_done.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reminder_id: reminder.id })
          });
        }
      });
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }, [user, notificationPermission]);

  // Check for due reminders and show notifications
  useEffect(() => {
    if (!user) return;

    // Check every minute
    const interval = setInterval(checkReminders, 60000);

    // Immediate check on mount
    checkReminders();

    return () => clearInterval(interval);
  }, [user, checkReminders]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <nav className="mb-4">
        <Link to="/" className="text-blue-600 font-semibold mx-2 hover:text-blue-800 transition">
          Home
        </Link>
        |
        <Link to="/form" className="text-blue-600 font-semibold mx-2 hover:text-blue-800 transition">
          User Form
        </Link>
        |
        <Link to="/login" className="text-blue-600 font-semibold mx-2 hover:text-blue-800 transition">
          Login
        </Link>
      </nav>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<UserForm />} />
          <Route path="/login" element={<Login />} />
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
  );
}

export default App;
