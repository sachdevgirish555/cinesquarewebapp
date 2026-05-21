import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCinemaAPI,
  deleteCinemaAPI,
  getCinemasAPI,
  updateCinemaAPI,
} from "../../services/cinemaService";

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

const extractCinema = (payload) => {
  if (!payload) return null;
  if (payload._id) return payload;
  if (payload.data?._id) return payload.data;
  return null;
};

export const createCinema = createAsyncThunk(
  "cinema/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createCinemaAPI(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to create cinema"));
    }
  },
);

export const getCinemas = createAsyncThunk(
  "cinema/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getCinemasAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch cinemas"));
    }
  },
);

export const deleteCinema = createAsyncThunk(
  "cinema/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCinemaAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Delete failed"));
    }
  },
);

export const updateCinema = createAsyncThunk(
  "cinema/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateCinemaAPI(id, data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Update failed"));
    }
  },
);

const initialState = {
  cinemas: [],
  cinema: null,
  loading: false,
  success: false,
  error: null,
};

const cinemaSlice = createSlice({
  name: "cinema",
  initialState,
  reducers: {
    resetCinemaState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.cinema = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCinema.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createCinema.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const createdCinema = extractCinema(action.payload);
        if (createdCinema) {
          state.cinema = createdCinema;
          state.cinemas.unshift(createdCinema);
        }
      })
      .addCase(createCinema.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCinemas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCinemas.fulfilled, (state, action) => {
        state.loading = false;
        state.cinemas = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(getCinemas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCinema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCinema.fulfilled, (state, action) => {
        state.loading = false;
        state.cinemas = state.cinemas.filter(
          (cinema) => cinema._id !== action.payload,
        );
      })
      .addCase(deleteCinema.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCinema.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateCinema.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedCinema = extractCinema(action.payload);
        if (!updatedCinema) {
          return;
        }

        state.cinema = updatedCinema;

        const index = state.cinemas.findIndex(
          (cinema) => cinema._id === updatedCinema._id,
        );

        if (index !== -1) {
          state.cinemas[index] = updatedCinema;
        } else {
          state.cinemas.unshift(updatedCinema);
        }
      })
      .addCase(updateCinema.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCinemaState } = cinemaSlice.actions;
export default cinemaSlice.reducer;
