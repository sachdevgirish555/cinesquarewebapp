import API from "./api";

export const getMovieApi = async () => {
  const res = await API.get("api/movies/");
  return res.data;
};

export const createMovieAPI = async (formData) => {
  const res = await API.post("api/movies/", formData);
  return res.data;
};

export const updateMovieAPI = async ({ id, formData }) => {
  const res = await API.put(`api/movies/${id}`, formData);
  return res.data;
};

export const deleteMovieAPI = async (id) => {
  const res = await API.delete(`api/movies/${id}`);
  return res.data;
};
