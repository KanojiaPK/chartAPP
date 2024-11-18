import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/user.router.js";
import chartRouter from "./routers/chart.router.js";
import logRouter from "./routers/logs.router.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8003;
const mongoURI = process.env.MONGODB_URI;

// CORS headers (placed at the top)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://savysupport-supportticketmangerfrontend.onrender.com"
    );
  } else {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Body parser
app.use(express.json());

// Serving static files
app.use("/uploads", express.static("uploads"));

// DB connectivity
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.error("DB Connection Error:", err));

// API routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chart", chartRouter);
app.use("/api/v1/log", logRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
