import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import {
  createVideo,
  getAllVideos,
  toggleLikesOfVideo,
  toggleDislikesOfVideo,
  toggleSavedByOfVideo,
  getViewsOfTheVideo,
  addCommentsInTheVideo,
  addReplyInTheComment,
} from "../controllers/video.controller.js";
import {
  addCommentsInTheShort,
  addReplyInTheCommentOfTheShort,
  createShort,
  getAllShorts,
  getViewsOfTheShort,
  toggleDislikesOfShort,
  toggleLikesOfShort,
  toggleSavedByOfShort,
} from "../controllers/short.controller.js";
import uploads from "../middlewares/multer.js";
import {
  createPlaylist,
  toggleSavedByPlaylist,
} from "../controllers/playlist.controller.js";
import {
  addCommentsInThePost,
  createPost,
  getAllPosts,
  toggleLikesOfPost,
} from "../controllers/post.controller.js";

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
contentRouter.put(
  "/video/:videoId/toggleLikes",
  protectedRoute,
  toggleLikesOfVideo
);
contentRouter.put(
  "/video/:videoId/toggleDislikes",
  protectedRoute,
  toggleDislikesOfVideo
);
contentRouter.put(
  "/video/:videoId/toggleSavedBy",
  protectedRoute,
  toggleSavedByOfVideo
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
contentRouter.put(
  "/short/:shortId/getViewsOfTheShort",
  protectedRoute,
  getViewsOfTheShort
);
contentRouter.put(
  "/short/:shortId/toggleLikes",
  protectedRoute,
  toggleLikesOfShort
);
contentRouter.put(
  "/short/:shortId/toggleDislikes",
  protectedRoute,
  toggleDislikesOfShort
);
contentRouter.put(
  "/short/:shortId/toggleSavedBy",
  protectedRoute,
  toggleSavedByOfShort
);
contentRouter.post(
  "/short/:shortId/addCommentsInTheShort",
  protectedRoute,
  addCommentsInTheShort
);
contentRouter.post(
  "/short/:shortId/:commentId/addReplyInTheComment",
  protectedRoute,
  addReplyInTheCommentOfTheShort
);
// shorts

contentRouter.post("/create-playlist", protectedRoute, createPlaylist);
contentRouter.put(
  "/playlist/toggleSavedBy",
  protectedRoute,
  toggleSavedByPlaylist
);
// playlists

contentRouter.post(
  "/create-post",
  protectedRoute,
  uploads.single("image"),
  createPost
);
contentRouter.get("/getAllPosts", getAllPosts);
contentRouter.put("/post/toggleLikes", protectedRoute, toggleLikesOfPost);
contentRouter.post(
  "/post/addCommentsInThePost",
  protectedRoute,
  addCommentsInThePost
);
contentRouter.post(
  "/post/addReplyInTheComment",
  protectedRoute,
  addReplyInTheComment
);
// posts

export default contentRouter;
