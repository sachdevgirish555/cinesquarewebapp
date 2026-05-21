import API from "./api";

export const AddVideoApi = async (data) => {
  const res = await API.post("api/videos", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// GET VIDEOS
export const getVideoApi = async () => {
  const res = await API.get("api/videos");
  return res.data;
};

// DELETE VIDEO
export const deleteVideoApi = async (id) => {
  const res = await API.delete(`api/videos/${id}`);
  return res.data;
};
