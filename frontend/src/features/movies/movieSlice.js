import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createMovieAPI,
  deleteMovieAPI,
  getMovieApi,
  updateMovieAPI,
} from "../../services/movieService";

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

export const getMovies = createAsyncThunk(
  "movies/getMovies",
  async (_, { rejectWithValue }) => {
    try {
      return await getMovieApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch movies"));
    }
  },
);

export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (formData, { rejectWithValue }) => {
    try {
      return await createMovieAPI(formData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Movie creation failed"));
    }
  },
);

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await updateMovieAPI({ id, formData });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Movie update failed"));
    }
  },
);

export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (id, { rejectWithValue }) => {
    try {
      await deleteMovieAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Movie delete failed"));
    }
  },
);

const initialState = {
  movies: [],
  loading: false,
  createLoading: false,
  createSuccess: false,
  updateLoading: false,
  updateSuccess: false,
  deleteLoading: false,
  error: null,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearMovies: (state) => {
      state.movies = [];
      state.error = null;
    },
    resetCreateMovie: (state) => {
      state.createLoading = false;
      state.createSuccess = false;
      state.updateLoading = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMovie.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.movies.unshift(action.payload);
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      .addCase(updateMovie.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;

        const index = state.movies.findIndex(
          (movie) => movie._id === action.payload._id,
        );

        if (index !== -1) {
          state.movies[index] = action.payload;
        }
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteMovie.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.movies = state.movies.filter(
          (movie) => movie._id !== action.payload,
        );
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMovies, resetCreateMovie } = movieSlice.actions;
export default movieSlice.reducer;
