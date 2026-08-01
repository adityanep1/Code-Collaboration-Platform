import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateRoom from "../pages/CreateRoom";
import JoinRoom from "../pages/JoinRoom";
import Room from "../pages/Room";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;