import React, { useEffect, useState } from "react";
import { Save, User, Mail, Key } from "lucide-react";
import { UserContext } from "../UserContext";

export default function UserProfile() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "" });
  const { setUsername } = React.useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://localhost:7155/api/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error response:", errorText);
          throw new Error("Failed to load user info.");
        }

        const data = await res.json();
        setUser(data);
        setForm({ ...form, username: data.username, email: data.email });
      } catch (err) {
        console.error("Error fetching user:", err);
        setMessage("Failed to load user info.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateFields = async () => {
    setErrors({ username: "", email: "" }); // Reset previous errors
    let hasErrors = false;

    const token = localStorage.getItem("token");

    // Check if the username exists
    if (form.username !== user.username) {
      try {
        const res = await fetch(`https://localhost:7155/api/user/exists/username?username=${encodeURIComponent(form.username)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.exists) {
          setErrors((prevErrors) => ({ ...prevErrors, username: "Username already taken." }));
          hasErrors = true;
        }
      } catch (err) {
        console.error("Error checking username:", err);
      }
    }

    // Check if the email exists
    if (form.email !== user.email) {
      try {
        const res = await fetch(`https://localhost:7155/api/user/exists/email?email=${encodeURIComponent(form.email)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.exists) {
          setErrors((prevErrors) => ({ ...prevErrors, email: "Email already exists." }));
          hasErrors = true;
        }
      } catch (err) {
        console.error("Error checking email:", err);
      }
    }

    return hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsername(form.username)
    setMessage("");

    // Validate fields before submitting
    const validationErrors = await validateFields();
    if (validationErrors) {
      return; // Stop submission if there are validation errors
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7155/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile.");
      }

      setMessage("Profile updated successfully!");

      // Hide the message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000); // Message disappears after 3 seconds

    } catch (err) {
      console.error("Error updating user:", err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow relative">
      <h2 className="text-2xl font-bold mb-4 text-orange-600 flex items-center gap-2">
        <User className="w-6 h-6" /> My Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4"autoComplete="off">
        <div>
          <label className="block font-semibold mb-1">Username</label>
          <div className="flex items-center border rounded px-2">
            <User className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-2 focus:outline-none"
              required
            />
          </div>
          {errors.username && (
            <span className="text-sm text-red-600">{errors.username}</span>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <div className="flex items-center border rounded px-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 focus:outline-none"
              required
            />
          </div>
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email}</span>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">New Password (optional)</label>
          <div className="flex items-center border rounded px-2">
            <Key className="w-5 h-5 text-gray-500" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 focus:outline-none"
              placeholder="Leave blank to keep current password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </form>

      {message && (
        <div
          className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded shadow-lg flex items-center gap-2 border border-orange-500"
        >
          <Save className="w-6 h-6 text-orange-500" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
