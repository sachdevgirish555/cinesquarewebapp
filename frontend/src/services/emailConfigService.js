import API from "./api";

export const getEmailConfigAPI = async (token) => {
  const res = await API.get("/api/enquiry/email-config", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateEmailConfigAPI = async (token, payload) => {
  const res = await API.put("/api/enquiry/email-config", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
