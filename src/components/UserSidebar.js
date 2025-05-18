import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// SVG icons for social links, phone, and location
const LinkedInIcon = () => (
  <svg className="w-5 h-5 mr-2 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.061-1.865-3.061-1.865 0-2.151 1.453-2.151 2.956v5.709h-3v-10h2.885v1.367h.041c.402-.762 1.381-1.565 2.844-1.565 3.042 0 3.604 2.003 3.604 4.605v5.593z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.974 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.07-1.276.058-2.675.334-3.637 1.297-.963.963-1.239 2.361-1.297 3.637-.058 1.28-.07 1.688-.07 4.947s.012 3.667.07 4.947c.058 1.276.334 2.675 1.297 3.637.963.963 2.361 1.239 3.637 1.297 1.28.058 1.688.07 4.947.07s3.667-.012 4.947-.07c1.276-.058 2.675-.334 3.637-1.297.963-.963 1.239-2.361 1.297-3.637.058-1.28.07-1.688.07-4.947s-.012-3.667-.07-4.947c-.058-1.276-.334-2.675-1.297-3.637-.963-.963-2.361-1.239-3.637-1.297-1.28-.058-1.688-.07-4.947-.07z"/>
    <circle cx="12" cy="12" r="3.5"/>
    <circle cx="18.406" cy="5.594" r="1.44"/>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.11-.21c1.21.49 2.53.76 3.9.76.55 0 1 .45 1 1v3.5c0 .55-.45 1-1 1C10.07 22 2 13.93 2 4.5c0-.55.45-1 1-1H6.5c.55 0 1 .45 1 1 0 1.37.27 2.69.76 3.9.16.39.07.85-.21 1.11l-2.2 2.2z"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 4.418 6 10 6 10s6-5.582 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2.94 5.12A2 2 0 014.5 4h11a2 2 0 011.56.72l-7.06 5.65a1 1 0 01-1.25 0L2.94 5.12z" />
    <path d="M18 8.08V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.08l7.47 5.98a3 3 0 003.06 0L18 8.08z" />
  </svg>
);

function UserSidebar() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    profile_pic: null,
    linkedin: "",
    instagram: "",
    phone: "",
    location: "",
    email: ""
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Reminders state
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    note_id: "",
    remind_at: "",
    message: ""
  });

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost/php-backend/get_user_profile.php?user_id=${user.id}`
        );
        const data = await response.json();
        if (data.success && data.profile) {
          setProfile({
            name: data.profile.name || "",
            bio: data.profile.bio || "",
            profile_pic: data.profile.profile_pic || null,
            linkedin: data.profile.linkedin || "",
            instagram: data.profile.instagram || "",
            phone: data.profile.phone || "",
            location: data.profile.location || "",
            email: data.profile.email || ""
          });
          setPreview(
            data.profile.profile_pic
              ? `http://localhost/php-backend/${data.profile.profile_pic}`
              : null
          );
        }
      } catch (err) {}
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  // Fetch user's notes for reminders dropdown
  useEffect(() => {
    async function fetchNotes() {
      if (!user?.id) return;
      try {
        const response = await fetch(
          `http://localhost/php-backend/get_notes.php?user_id=${user.id}`
        );
        const data = await response.json();
        setNotes(data);
      } catch (err) {}
    }
    fetchNotes();
  }, [user]);

  // Fetch reminders
  const fetchReminders = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(
        `http://localhost/php-backend/get_reminders.php?user_id=${user.id}`
      );
      const result = await response.json();
      setReminders(result.data || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchReminders();
  }, [user]);

  // Add reminder
  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newReminder.note_id || !newReminder.remind_at) return;
    try {
      const response = await fetch("http://localhost/php-backend/add_reminder.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          ...newReminder
        })
      });
      const result = await response.json();
      if (result.success) {
        setShowAddReminder(false);
        setNewReminder({ note_id: "", remind_at: "", message: "" });
        fetchReminders();
      }
    } catch (err) {}
  };

  // Mark reminder as done
  const handleMarkDone = async (reminderId) => {
    await fetch("http://localhost/php-backend/mark_reminder_done.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reminder_id: reminderId })
    });
    fetchReminders();
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/php-backend/update_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            name: profile.name,
            bio: profile.bio,
            profile_pic: profile.profile_pic,
            linkedin: profile.linkedin,
            instagram: profile.instagram,
            phone: profile.phone,
            location: profile.location,
            email: profile.email
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setEditing(false);
        setUser({ ...user, name: profile.name, profile_pic: profile.profile_pic });
        alert("Profile updated!");
      } else {
        alert(result.message || "Failed to update profile.");
      }
    } catch (error) {
      alert("Server error.");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setUploading(true);
    const formData = new FormData();
    formData.append("profile_pic", file);
    formData.append("user_id", user.id);
    try {
      const res = await fetch(
        "http://localhost/php-backend/upload_profile_pic.php",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          profile_pic: data.profile_pic,
        }));
        setUser({ ...user, profile_pic: data.profile_pic });
        setPreview(`http://localhost/php-backend/${data.profile_pic}`);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (err) {
      alert("Image upload failed.");
    }
    setUploading(false);
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  // Profile completion calculation
  const fields = [
    profile.name,
    profile.bio,
    profile.profile_pic,
    profile.linkedin,
    profile.instagram,
    profile.phone,
    profile.location,
    profile.email
  ];
  const completed = fields.filter(Boolean).length;
  const percent = Math.round((completed / fields.length) * 100);

  return (
    <div className="p-6 flex flex-col items-center">
      {/* Profile Completion Bar */}
      <div className="w-full bg-gray-200 rounded h-2 mt-2 mb-1">
        <div
          className="bg-blue-600 h-2 rounded"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mb-2">{percent}% Profile Complete</p>
      {/* Avatar or uploaded profile picture */}
      <div className="relative mb-2">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
            {getInitials(profile.name || "User")}
          </div>
        )}
        <input
          id="profile-pic-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute bottom-0 right-0 w-6 h-6 opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
          title="Upload profile picture"
        />
        <label
          htmlFor="profile-pic-upload"
          className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer"
          style={{ zIndex: 1 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 13h6m2 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </label>
        {uploading && (
          <span className="text-xs absolute top-0 left-0 bg-white px-2 py-1 rounded">
            Uploading...
          </span>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : !editing ? (
        <>
          <h2 className="font-bold text-lg">{profile.name || "No Name"}</h2>
          <p className="text-gray-600 mt-2 text-center">
            {profile.bio || "No bio yet."}
          </p>
          <div className="mt-4 w-full flex flex-col gap-2">
            {profile.email && (
              <div className="flex items-center text-yellow-600">
                <MailIcon />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center text-red-500">
                <LocationIcon />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:underline hover:text-blue-700"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram.startsWith("http") ? profile.instagram : `https://instagram.com/${profile.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:underline hover:text-pink-500"
              >
                <InstagramIcon />
                <span>Instagram</span>
              </a>
            )}
            {profile.phone && (
              <div className="flex items-center text-green-600">
                <PhoneIcon />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>
          <button
            className="mt-4 px-4 py-1 bg-blue-600 text-white rounded"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </>
      ) : (
        <form className="flex flex-col items-center w-full" onSubmit={handleSave}>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Name"
            className="mb-2 p-1 border rounded w-full"
            required
          />
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Short bio"
            className="mb-2 p-1 border rounded w-full"
            rows={2}
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            className="mb-2 p-1 border rounded w-full"
          />
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            placeholder="Location (City, Country)"
            className="mb-2 p-1 border rounded w-full"
          />
          <input
            type="text"
            name="linkedin"
            value={profile.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="mb-2 p-1 border rounded w-full"
          />
          <input
            type="text"
            name="instagram"
            value={profile.instagram}
            onChange={handleChange}
            placeholder="Instagram username or URL"
            className="mb-2 p-1 border rounded w-full"
          />
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="mb-2 p-1 border rounded w-full"
          />
          <button
            className="px-4 py-1 bg-green-600 text-white rounded"
            type="submit"
          >
            Save
          </button>
          <button
            className="mt-2 px-4 py-1 bg-gray-300 text-black rounded"
            type="button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {/* --- Reminders Section --- */}
      <div className="w-full mt-8">
        <h3 className="text-lg font-bold mb-4 text-blue-700">Reminders</h3>
        <button
          onClick={() => setShowAddReminder(true)}
          className="w-full mb-4 bg-blue-100 text-blue-800 p-2 rounded hover:bg-blue-200"
        >
          + Add Reminder
        </button>
        {/* Add Reminder Form */}
        {showAddReminder && (
          <form onSubmit={handleAddReminder} className="mb-4 bg-gray-50 p-3 rounded border">
            <select
              required
              className="w-full p-2 mb-2 border rounded"
              value={newReminder.note_id}
              onChange={(e) =>
                setNewReminder({ ...newReminder, note_id: e.target.value })
              }
            >
              <option value="">Select Note</option>
              {notes.map((note) => (
                <option key={note.id} value={note.id}>
                  {note.title}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              required
              className="w-full p-2 mb-2 border rounded"
              value={newReminder.remind_at}
              onChange={(e) =>
                setNewReminder({ ...newReminder, remind_at: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Message (optional)"
              className="w-full p-2 mb-2 border rounded"
              value={newReminder.message}
              onChange={(e) =>
                setNewReminder({ ...newReminder, message: e.target.value })
              }
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white p-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddReminder(false)}
                className="flex-1 bg-gray-200 p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reminders List */}
        <div className="space-y-2">
          {reminders.length === 0 && (
            <p className="text-gray-400 text-center">No reminders yet.</p>
          )}
          {reminders.map((reminder) => (
            <div key={reminder.id} className="p-2 bg-gray-50 rounded border">
              <div className="font-medium">{reminder.note_title}</div>
              <div className="text-sm text-gray-600">
                {new Date(reminder.remind_at).toLocaleString()}
              </div>
              {reminder.message && (
                <div className="text-sm italic">"{reminder.message}"</div>
              )}
              <button
                onClick={() => handleMarkDone(reminder.id)}
                className="text-xs text-green-600 hover:text-green-800 mt-2"
              >
                Mark Done
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* --- End Reminders Section --- */}
    </div>
  );
}

export default UserSidebar;
