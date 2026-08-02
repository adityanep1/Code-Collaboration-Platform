import api from "./api";

export const runCodeAPI = async (language, code) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/code/run",
    {
      language,
      code,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};