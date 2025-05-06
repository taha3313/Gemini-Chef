import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext"; // adjust path if needed

import Header from "./Header";
import Main from "./Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import UserProfile from "./pages/UserProfile";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
