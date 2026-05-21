import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { contactServiceAPI } from "../../services/contactService";

// ================= THUNK =================
export const sendEnquiry = createAsyncThunk(
  "contact/sendEnquiry",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await contactServiceAPI(payload);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  },
);

// ================= SLICE =================
const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },

  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(sendEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Fulfilled
      .addCase(sendEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })

      // Rejected
      .addCase(sendEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
