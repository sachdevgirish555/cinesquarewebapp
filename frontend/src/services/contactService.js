import API from "./api";

export const contactServiceAPI = async (data) => {
  const res = await API.post("/api/enquiry", data);
  return res.data;
};
