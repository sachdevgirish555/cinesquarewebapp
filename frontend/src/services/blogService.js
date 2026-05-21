import API from "./api";

export const getBlogApi = async () => {
  const res = await API.get("api/blogs");
  return res.data;
};

export const getBlogByIdApi = async (id) => {
  const res = await API.get(`api/blogs/${id}`);
  return res.data;
};

export const createBlogAPI = async (formData) => {
  const res = await API.post("api/blogs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ UPDATE BLOG (PUT)
export const updateBlogAPI = async ({ id, formData }) => {
  const res = await API.put(`api/blogs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ DELETE BLOG
export const deleteBlogAPI = async (id) => {
  const res = await API.delete(`api/blogs/${id}`);
  return res.data;
};
