import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AddVideoApi,
  deleteVideoApi,
  getVideoApi,
} from "../../services/videoService";

// ================= ADD VIDEO =================
export const addVideo = createAsyncThunk(
  "video/addVideo",
  async (data, { rejectWithValue }) => {
    try {
      return await AddVideoApi(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

// ================= GET VIDEOS =================
export const getVideos = createAsyncThunk(
  "video/getVideos",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getVideoApi();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetch failed");
    }
  },
);

// DELETE VIDEO
export const deleteVideo = createAsyncThunk(
  "video/deleteVideo",
  async (id, { rejectWithValue }) => {
    try {
      await deleteVideoApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

const initialState = {
  loading: false,
  videos: [], // store list
  video: null,
  error: null,
  success: false,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    resetVideoState: (state) => {
      state.loading = false;
      state.video = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== ADD =====
      .addCase(addVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload;
        state.success = true;

        // add to list instantly
        state.videos.unshift(action.payload);
      })
      .addCase(addVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET =====
      .addCase(getVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(getVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // DELETE
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter(
          (video) => video._id !== action.payload,
        );
      });
  },
});

export const { resetVideoState } = videoSlice.actions;
export default videoSlice.reducer;
