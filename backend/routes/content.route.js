import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { createVideo } from "../controllers/video.controller.js";
import { createShort } from "../controllers/short.controller.js";
import uploads from "../middlewares/multer.js";

const contentRouter = express.Router();

contentRouter.post(
  "/create-video",
  protectedRoute,
  uploads.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
); // videos

contentRouter.post(
  "/create-short",
  protectedRoute,
  uploads.single("short"),
  createShort
); // shorts

export default contentRouter;
