/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Mail, Lock } from "lucide-react";

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode JWT", err);
    return null;
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUsername } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      const decoded = decodeJWT(data.token);
      if (decoded?.username) {
        setUsername(decoded.username);
      }
      navigate("/");
    } catch (err) {
      alert("Login failed.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-2xl shadow space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

      <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
        <Mail className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email or username"
          required
          className="w-full focus:outline-none"
        />
      </div>

      <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
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
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Login
      </button>
    </form>
  );
}
