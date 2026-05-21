import API from "./api";

/* ADD GALLERY IMAGES */
export const addGalleryAPI = async (formData) => {
  const res = await API.post("/api/cinema-galleries", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/* GET ALL */
export const getGalleryAPI = async () => {
  const res = await API.get("/api/cinema-galleries");
  return res.data.data;
};

/* GET BY CINEMA */
export const getGalleryByCinemaAPI = async (cinemaId) => {
  const res = await API.get(`/api/cinema-galleries/cinema/${cinemaId}`);
  return res.data;
};

/* DELETE */
export const deleteGalleryAPI = async (id) => {
  const res = await API.delete(`/api/cinema-galleries/${id}`);
  return res.data;
};
