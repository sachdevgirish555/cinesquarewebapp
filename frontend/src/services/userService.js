import API from "./api";

export const createUserAPI = async (data) => {
  const res = await API.post("/api/users/register", data);
  return res.data;
};

export const getUsersAPI = async (token) => {
  try {
    const res = await API.get("/api/users/getAllUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserAPI = async (id, token) => {
  try {
    const res = await API.delete(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const loginUserAPI = async (data) => {
  const res = await API.post("/api/users/login", data);
  return res.data.data;
};
