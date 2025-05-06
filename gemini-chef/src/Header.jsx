import React from "react";
import chefClaudeLogo from "./images/chef-claude-icon.png";
import { useNavigate } from "react-router-dom";
import { logout } from "./services/auth";
import { UserContext } from "./UserContext";
import {
  LogOut,
  Heart,
  LogIn,
  UserPlus,
  ChefHat,
  User
} from "lucide-react";



export default function Header() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); 
  

  const { username } = React.useContext(UserContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-orange-50 border-b border-orange-200 py-4 shadow-md px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img src={chefClaudeLogo} alt="Chef Gemini logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-amber-800 tracking-wide">Chef Gemini</h1>

          <button
            onClick={() => navigate("/")}
            className="ml-6 flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
          >
            <ChefHat className="w-5 h-5" />
            Start Cooking
          </button>
        </div>

        {/* Center Section */}
        {token && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-lg font-semibold text-gray-700">
              Hello, @{username ? username : "Guest"}!
            </span>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
              >
                <User className="w-5 h-5" />
                Profile
              </button>

              <button
                onClick={() => navigate("/favorites")}
                className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
              >
                <Heart className="w-5 h-5" />
                Favorites
              </button>

              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                <LogIn className="w-5 h-5" />
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                <UserPlus className="w-5 h-5" />
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
