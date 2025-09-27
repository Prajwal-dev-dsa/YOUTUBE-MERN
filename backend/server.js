import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/dB.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 8000;

// routes
app.use("/api/auth", authRouter);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
