import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Dashboard</h1>

      <br />

      <button onClick={() => navigate("/create-room")}>
        Create Room
      </button>

      <br />
      <br />

      <button onClick={() => navigate("/join-room")}>
        Join Room
      </button>

      <br />
      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;