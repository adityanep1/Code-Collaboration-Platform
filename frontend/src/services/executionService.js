import api from "./api";

// Save Execution
export const saveExecutionAPI = async (data) => {
  const response = await api.post("/executions", data);
  return response.data;
};

// Get History
export const getExecutionHistoryAPI = async (roomCode) => {
  const response = await api.get(`/executions/${roomCode}`);
  return response.data;
};