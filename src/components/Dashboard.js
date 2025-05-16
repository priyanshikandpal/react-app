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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 flex">
      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 bg-white shadow-2xl w-72 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <UserSidebar />
        {/* Close button inside sidebar */}
        <button
          className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-pink-500 transition"
          onClick={() => setSidebarOpen(false)}
          title="Close sidebar"
        >
          &times;
        </button>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 bg-gradient-to-br from-blue-600 to-pink-500 text-white rounded-full p-3 shadow-xl hover:scale-110 transition-transform focus:outline-none"
        onClick={() => setSidebarOpen(true)}
        style={{ display: sidebarOpen ? "none" : "block" }}
        title="Open sidebar"
      >
        {/* Hamburger icon */}
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 8h20M4 14h20M4 20h20" />
        </svg>
      </button>

      {/* Main Content: fills remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center px-2">
        <div className="mt-10 p-8 bg-white/90 rounded-3xl shadow-2xl w-full max-w-2xl relative flex flex-col border border-pink-100">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">
            Welcome to your personalized notes app!
          </h2>
          <p className="text-gray-600 text-center mb-6 text-lg">
            You are now logged in. Start creating your notes!
          </p>

          {/* --- Total Notes Card --- */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-100 via-pink-100 to-purple-100 text-blue-800 rounded-2xl p-5 flex items-center justify-between shadow-lg border border-blue-100">
              <span className="font-bold text-xl">Total Notes</span>
              <span className="text-3xl font-extrabold text-pink-500">{notes.length}</span>
            </div>
          </div>

          {/* --- Recent Activity --- */}
          <div className="mb-8">
            <div className="font-semibold mb-3 text-lg text-blue-700">Recent Activity</div>
            {recentNotes.length === 0 ? (
              <p className="text-gray-400 text-base italic">No recent notes.</p>
            ) : (
              <ul>
                {recentNotes.map((n) => (
                  <li key={n.id} className="mb-2 p-3 bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl shadow flex justify-between items-center border border-pink-100">
                    <span className="font-medium text-blue-800">{n.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="mb-8 space-y-4">
            <input
              type="text"
              name="title"
              value={note.title}
              onChange={handleChange}
              placeholder="Note Title"
              className="w-full p-3 border-2 rounded-xl border-blue-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              required
            />
            <textarea
              name="content"
              value={note.content}
              onChange={handleChange}
              placeholder="Note Content"
              className="w-full p-3 border-2 rounded-xl border-blue-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              rows={3}
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Add Note
            </button>
          </form>

          {/* Notes List */}
          <div className="mb-6">
            {notes.length === 0 ? (
              <p className="text-gray-400 text-center italic">No notes yet.</p>
            ) : (
              notes.map((n) => (
                <div
                  key={n.id}
                  className="mb-5 p-5 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 rounded-2xl shadow-lg flex justify-between items-start border border-blue-100"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-pink-600 mb-1">{n.title}</h3>
                    <p className="text-gray-700">{n.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(n.id)}
                    className="ml-4 text-red-500 hover:text-red-700 font-bold text-2xl"
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
            className="w-full bg-gradient-to-r from-pink-500 to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform mt-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
