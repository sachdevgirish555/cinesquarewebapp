import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./features/Blog/blogSlice";
import movieReducer from "./features/movies/movieSlice";
import contactReducer from "./features/Contact/contactSlice";
import enquiryReducer from "./features/Enquiry/enquirySlice";
import videoReducer from "./features/Video/videoSlice";
import sliderReducer from "./features/Slider/sliderSlice";
import userReducer from "./features/User/userSlice";
import authReducer from "./features/auth/authSlice";
import cinemaReducer from "./features/Cinema/cinemaSlice";
import galleryReducer from "./features/CinemaGallery/gallerySlice";

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    movies: movieReducer,
    contact: contactReducer,
    enquiry: enquiryReducer,
    video: videoReducer,
    slider: sliderReducer,
    user: userReducer,
    auth: authReducer,
    cinema: cinemaReducer,
    gallery: galleryReducer, // ✅ THIS MUST EXIST
  },
});
