import api from "./api";

export const saveCodeAPI = async (roomCode, code) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/rooms/save",
    { roomCode, code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getRoomAPI = async (roomCode) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/rooms/${roomCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};