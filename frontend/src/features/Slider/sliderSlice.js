import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  appSlider,
  appSliderData,
  deleteSliderService,
} from "../../services/sliderService";

// CREATE
export const createSlider = createAsyncThunk(
  "slider/create",
  async (data, { rejectWithValue }) => {
    try {
      return await appSliderData(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Slider upload failed");
    }
  },
);

// GET
export const getSlider = createAsyncThunk(
  "slider/get",
  async (_, { rejectWithValue }) => {
    try {
      return await appSlider();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Unable to fetch sliders");
    }
  },
);

// DELETE
export const deleteSlider = createAsyncThunk(
  "slider/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteSliderService(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Unable to delete slider");
    }
  },
);

const initialState = {
  loading: false,
  sliders: [],
  error: null,
};

const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSlider.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSlider.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders.unshift(action.payload);
      })
      .addCase(createSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteSlider.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteSlider.fulfilled, (state, action) => {
        state.sliders = state.sliders.filter(
          (slide) => slide._id !== action.payload,
        );
      })
      .addCase(deleteSlider.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default sliderSlice.reducer;
