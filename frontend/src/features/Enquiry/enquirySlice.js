// src/features/enquiry/enquirySlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteEnquiryApi, getEnquiryApi } from "../../services/enquiryService";

// Fetch Enquiry
export const fetchEnquiries = createAsyncThunk(
  "enquiry/fetchEnquiries",
  async ({ page = 1, limit = 10 } = {}) => {
    return await getEnquiryApi(page, limit);
  },
);

// Delete Enquiry
export const deleteEnquiry = createAsyncThunk(
  "enquiry/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteEnquiryApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const enquirySlice = createSlice({
  name: "enquiry",
  initialState: {
    enquiries: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalEnquiries: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload.data || action.payload.enquiries || [];
        state.pagination = {
          currentPage: action.payload.currentPage || action.payload.pagination?.currentPage || 1,
          totalPages: action.payload.totalPages || action.payload.pagination?.totalPages || 1,
          totalEnquiries: action.payload.total || action.payload.totalEnquiries || action.payload.pagination?.total || 0,
        };
      })
      .addCase(fetchEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEnquiry.fulfilled, (state, action) => {
        state.enquiries = state.enquiries.filter((e) => e._id !== action.payload);
        state.pagination.totalEnquiries = Math.max(
          0,
          (state.pagination.totalEnquiries || 0) - 1
        );
      });
  },
});

export default enquirySlice.reducer;
