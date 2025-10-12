import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createVideo,
  getAllVideos,
  getViewsOfTheVideo,
  toggleDislikes,
  toggleLikes,
  toggleSavedBy,
  addCommentsInTheVideo,
  addReplyInTheComment,
} from "../controllers/video.controller.js";
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
contentRouter.put(
  "/video/:videoId/getViewsOfTheVideo",
  protectedRoute,
  getViewsOfTheVideo
);
contentRouter.put("/video/:videoId/toggleLikes", protectedRoute, toggleLikes);
contentRouter.put(
  "/video/:videoId/toggleDislikes",
  protectedRoute,
  toggleDislikes
);
contentRouter.put(
  "/video/:videoId/toggleSavedBy",
  protectedRoute,
  toggleSavedBy
);
contentRouter.post(
  "/video/:videoId/addCommentsInTheVideo",
  protectedRoute,
  addCommentsInTheVideo
);
contentRouter.post(
  "/video/:videoId/:commentId/addReplyInTheComment",
  protectedRoute,
  addReplyInTheComment
);
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
