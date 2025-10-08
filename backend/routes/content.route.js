import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { createVideo, getAllVideos } from "../controllers/video.controller.js";
import { createShort, getAllShorts } from "../controllers/short.controller.js";
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
);
contentRouter.get("/getAllVideos", protectedRoute, getAllVideos);
// videos

contentRouter.post(
  "/create-short",
  protectedRoute,
  uploads.single("short"),
  createShort
);
contentRouter.get("/getAllShorts", protectedRoute, getAllShorts);
// shorts

export default contentRouter;
