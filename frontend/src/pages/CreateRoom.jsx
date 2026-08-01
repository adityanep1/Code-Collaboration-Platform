import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import api from "../services/api";

const CreateRoom = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomName: "",
    language: "javascript",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/rooms/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      alert("Room Created Successfully!");

      navigate(`/room/${response.data.room.roomCode}`);

    } catch (error) {
      console.log(error.response?.data);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Create Room</h1>

      <br />

      <Input
        name="roomName"
        placeholder="Enter Room Name"
        value={formData.roomName}
        onChange={handleChange}
      />

      <br />

      <select
        name="language"
        value={formData.language}
        onChange={handleChange}
      >
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>

      <br />
      <br />

      <button onClick={handleSubmit}>
        Create Room
      </button>

    </div>
  );
};

export default CreateRoom;