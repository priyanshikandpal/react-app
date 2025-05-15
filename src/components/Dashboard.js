import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UserSidebar from "./UserSidebar";

function Dashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({ title: "", content: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch notes from backend for the logged-in user
  const fetchNotes = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost/php-backend/get_notes.php?user_id=${user.id}`
      );
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      alert("Failed to fetch notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Add new note (save to backend)
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You are not logged in.");
      return;
    }

    if (note.title.trim() && note.content.trim()) {
      try {
        const response = await fetch("http://localhost/php-backend/save_note.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: note.title,
            content: note.content,
            user_id: user.id,
          }),
        });
        const result = await response.json();
        if (result.success) {
          setNote({ title: "", content: "" });
          fetchNotes();
        } else {
          alert(result.message || "Failed to save note.");
        }
      } catch (error) {
        alert("Failed to save note.");
      }
    } else {
      alert("Please fill all fields and make sure you are logged in.");
    }
  };

  // Delete a note (backend)
  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(
        "http://localhost/php-backend/delete_note.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setNotes(notes.filter((n) => n.id !== id));
      } else {
        alert(result.message || "Failed to delete note.");
      }
    } catch (error) {
      alert("Failed to delete note.");
    }
  };

  // Get the 5 most recent notes (assuming notes are ordered newest first)
  const recentNotes = notes.slice(0, 5);

  return (
    <div className="relative min-h-screen bg-gray-100 flex">
      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 bg-white shadow-md w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <UserSidebar />
        {/* Close button inside sidebar */}
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-900"
          onClick={() => setSidebarOpen(false)}
          title="Close sidebar"
        >
          &times;
        </button>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 focus:outline-none"
        onClick={() => setSidebarOpen(true)}
        style={{ display: sidebarOpen ? "none" : "block" }}
        title="Open sidebar"
      >
        {/* Hamburger icon */}
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content: fills remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mt-8 p-8 bg-white rounded shadow-md w-full max-w-xl relative flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Welcome to your personalized notes app!
          </h2>
          <p className="text-gray-700 text-center mb-6">
            You are now logged in. Start creating your notes!
          </p>

          {/* --- Total Notes Card --- */}
          <div className="mb-6">
            <div className="bg-blue-100 text-blue-800 rounded p-4 flex items-center justify-between shadow">
              <span className="font-bold text-lg">Total Notes</span>
              <span className="text-2xl font-extrabold">{notes.length}</span>
            </div>
          </div>

          {/* --- Recent Activity --- */}
          <div className="mb-6">
            <div className="font-semibold mb-2">Recent Activity</div>
            {recentNotes.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent notes.</p>
            ) : (
              <ul>
                {recentNotes.map((n) => (
                  <li key={n.id} className="mb-2 p-2 bg-gray-50 rounded shadow flex justify-between items-center">
                    <span className="font-medium">{n.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="mb-6 space-y-3">
            <input
              type="text"
              name="title"
              value={note.title}
              onChange={handleChange}
              placeholder="Note Title"
              className="w-full p-2 border rounded border-gray-300"
              required
            />
            <textarea
              name="content"
              value={note.content}
              onChange={handleChange}
              placeholder="Note Content"
              className="w-full p-2 border rounded border-gray-300"
              rows={3}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Add Note
            </button>
          </form>

          {/* Notes List */}
          <div className="mb-6">
            {notes.length === 0 ? (
              <p className="text-gray-500 text-center">No notes yet.</p>
            ) : (
              notes.map((n) => (
                <div
                  key={n.id}
                  className="mb-4 p-4 bg-gray-50 rounded shadow flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold">{n.title}</h3>
                    <p className="text-gray-700">{n.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(n.id)}
                    className="ml-4 text-red-500 hover:text-red-700 font-bold"
                    title="Delete note"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Logout Button at the bottom */}
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition mt-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
