import API from "./api";

export const appSliderData = async (data) => {
  const res = await API.post("/api/slider", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const appSlider = async () => {
  const res = await API.get("/api/slider");
  return res.data;
};

export const deleteSliderService = async (id) => {
  const res = await API.delete(`/api/slider/${id}`);
  return res.data;
};
