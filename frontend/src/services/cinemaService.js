import API from "./api";

export const createCinemaAPI = async (data) => {
  const res = await API.post("/api/cinemas", data);
  return res.data;
};

export const getCinemasAPI = async () => {
  const res = await API.get("/api/cinemas");
  return res.data;
};

export const deleteCinemaAPI = async (id) => {
  const res = await API.delete(`/api/cinemas/${id}`);
  return res.data;
};

export const updateCinemaAPI = async (id, data) => {
  const res = await API.put(`/api/cinemas/${id}`, data);
  return res.data;
};
