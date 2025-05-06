/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { register } from "../services/auth";
import { Mail, Lock } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await register(email, password);
      localStorage.setItem("token", data.token);
      alert("Registered successfully!");
    } catch (err) {
      alert("Registration failed.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-2xl shadow space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

      <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <Mail className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full focus:outline-none"
        />
      </div>

      <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <Lock className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
}
