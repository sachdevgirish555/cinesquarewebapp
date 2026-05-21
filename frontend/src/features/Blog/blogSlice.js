import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createBlogAPI,
  deleteBlogAPI,
  getBlogApi,
  getBlogByIdApi,
  updateBlogAPI,
} from "../../services/blogService";

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") {
    return error;
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    error?.data?.message ||
    fallback
  );
};

const extractBlogList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const extractBlogItem = (payload) => {
  if (payload?._id) {
    return payload;
  }

  if (payload?.data?._id) {
    return payload.data;
  }

  return null;
};

export const getBlogs = createAsyncThunk(
  "blogs/getBlogs",
  async (_, { rejectWithValue }) => {
    try {
      return await getBlogApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch blogs"));
    }
  },
);

export const getBlogById = createAsyncThunk(
  "blogs/getBlogById",
  async (id, { rejectWithValue }) => {
    try {
      return await getBlogByIdApi(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch blog details"),
      );
    }
  },
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (formData, { rejectWithValue }) => {
    try {
      return await createBlogAPI(formData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Blog creation failed"));
    }
  },
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await updateBlogAPI({ id, formData });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Blog update failed"));
    }
  },
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBlogAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Blog delete failed"));
    }
  },
);

const initialState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  blogDetailsLoading: false,
  error: null,
  blogDetailsError: null,
  createLoading: false,
  createSuccess: false,
  updateLoading: false,
  updateSuccess: false,
  deleteLoading: false,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearBlogs: (state) => {
      state.blogs = [];
      state.error = null;
    },
    resetCreateBlog: (state) => {
      state.createLoading = false;
      state.createSuccess = false;
      state.updateLoading = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = extractBlogList(action.payload);
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        const createdBlog = extractBlogItem(action.payload);
        if (createdBlog) {
          state.blogs.unshift(createdBlog);
        }
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      .addCase(getBlogById.pending, (state) => {
        state.blogDetailsLoading = true;
        state.blogDetailsError = null;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.blogDetailsLoading = false;
        state.selectedBlog = extractBlogItem(action.payload) || action.payload;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.blogDetailsLoading = false;
        state.blogDetailsError = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;

        const updatedBlog = extractBlogItem(action.payload);
        if (!updatedBlog) {
          return;
        }

        const index = state.blogs.findIndex(
          (blog) => blog._id === updatedBlog._id,
        );

        if (index !== -1) {
          state.blogs[index] = updatedBlog;
        } else {
          state.blogs.unshift(updatedBlog);
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogs, resetCreateBlog } = blogSlice.actions;
export default blogSlice.reducer;
