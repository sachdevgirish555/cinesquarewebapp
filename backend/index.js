const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const path = require("path");

const connectDB = require("./config/db");
const blogRoutes = require("./routes/blog.routes");
const videoRoutes = require("./routes/video.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

// ================= SECURITY =================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ================= CORS =================
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// ================= BODY =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================= STATIC =================
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "uploads"))
);
console.log("Uploads path:", path.resolve(__dirname, "uploads"));

app.use(morgan("combined"));

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    env: NODE_ENV,
    time: new Date(),
  });
});


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cinemas", require("./routes/cinema.routes"));
app.use("/api/cinema-galleries", require("./routes/cinemaGallery.routes"));
app.use("/api/movies", require("./routes/movie.routes"));
app.use("/api/enquiry", require("./routes/enquiry.routes"));
app.use("/api/slider", require("./routes/slider.Routes"));
app.use("/api/videos", require("./routes/video.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ================= ERROR =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Server error",
  });
});

// ================= DB CONNECT =================
connectDB().catch(err => console.error("Mongo error:", err));

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});