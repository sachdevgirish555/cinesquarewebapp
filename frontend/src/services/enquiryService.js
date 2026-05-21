import API from "./api";

export const getEnquiryApi = async (page = 1, limit = 10) => {
  const res = await API.get(`api/enquiry?page=${page}&limit=${limit}`);
  return res.data;
};

export const deleteEnquiryApi = async (id) => {
  const res = await API.delete(`api/enquiry/${id}`);
  return res.data;
};
