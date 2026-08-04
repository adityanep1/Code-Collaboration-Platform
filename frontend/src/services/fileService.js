import api from "./api";

// Create File / Folder
export const createFileAPI = async (data) => {
  const response = await api.post("/files", data);
  return response.data;
};

// Get Files
export const getFilesAPI = async (roomCode) => {
  const response = await api.get(`/files/${roomCode}`);
  return response.data;
};


// Get Single File
export const getFileAPI = async (id) => {
  const response = await api.get(`/files/single/${id}`);
  return response.data;
};

// Update File
export const updateFileAPI = async (id, data) => {
  const response = await api.put(`/files/${id}`, data);
  return response.data;
};

// Rename File
export const renameFileAPI = async (id, fileName) => {
  const response = await api.put(`/files/${id}`, {
    fileName,
  });

  return response.data;
};

// Delete File
export const deleteFileAPI = async (id) => {
  const response = await api.delete(`/files/${id}`);
  return response.data;
};