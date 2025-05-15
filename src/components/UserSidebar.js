import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function UserSidebar() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile info from backend when sidebar loads or user changes
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
          });
        }
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save profile to backend
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
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setEditing(false);
        setUser({ ...user, name: profile.name }); // Update context if needed
        alert("Profile updated!");
      } else {
        alert(result.message || "Failed to update profile.");
      }
    } catch (error) {
      alert("Server error.");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      {/* Avatar using initials */}
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
          profile.name || "User"
        )}`}
        alt="User avatar"
        className="w-20 h-20 rounded-full mb-2"
      />
      {loading ? (
        <p>Loading...</p>
      ) : !editing ? (
        <>
          <h2 className="font-bold text-lg">{profile.name || "No Name"}</h2>
          <p className="text-gray-600 mt-2 text-center">
            {profile.bio || "No bio yet."}
          </p>
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
    </div>
  );
}

export default UserSidebar;
