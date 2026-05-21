import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addGalleryAPI,
  deleteGalleryAPI,
  getGalleryAPI,
  getGalleryByCinemaAPI,
} from "../../services/cinemaGalleryService";

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

const extractGalleryList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (payload?.data && Array.isArray(payload.data.data)) {
    return payload.data.data;
  }

  return [];
};

const extractGalleryItem = (payload) => {
  if (payload?._id) {
    return payload;
  }

  if (payload?.data?._id) {
    return payload.data;
  }

  return null;
};

export const addGallery = createAsyncThunk(
  "gallery/add",
  async (formData, { rejectWithValue }) => {
    try {
      return await addGalleryAPI(formData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to add gallery"));
    }
  },
);

export const getGallery = createAsyncThunk(
  "gallery/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getGalleryAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch gallery"));
    }
  },
);

export const getGalleryByCinema = createAsyncThunk(
  "gallery/getByCinema",
  async (cinemaId, { rejectWithValue }) => {
    try {
      if (!cinemaId) {
        return [];
      }

      return await getGalleryByCinemaAPI(cinemaId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch cinema gallery"));
    }
  },
);

export const deleteGallery = createAsyncThunk(
  "gallery/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteGalleryAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Delete failed"));
    }
  },
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    galleries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGallery.fulfilled, (state, action) => {
        state.loading = false;
        const createdGallery = extractGalleryItem(action.payload);
        if (createdGallery) {
          state.galleries.unshift(createdGallery);
        }
      })
      .addCase(addGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = extractGalleryList(action.payload);
      })
      .addCase(getGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGalleryByCinema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGalleryByCinema.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = extractGalleryList(action.payload);
      })
      .addCase(getGalleryByCinema.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.galleries = [];
      })
      .addCase(deleteGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = state.galleries.filter(
          (gallery) => gallery._id !== action.payload,
        );
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gallerySlice.reducer;
