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
  getUserLikedVideos,
} from "../controllers/video.controller.js";
import {
  addCommentsInTheShort,
  addReplyInTheCommentOfTheShort,
  createShort,
  getAllShorts,
  getUserLikedShorts,
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
  addReplyToPostComment,
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
contentRouter.get("/getUserLikedVideos", protectedRoute, getUserLikedVideos);
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
contentRouter.get("/getUserLikedShorts", protectedRoute, getUserLikedShorts);
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
contentRouter.get("/getAllPosts", protectedRoute, getAllPosts); // Added protectedRoute
contentRouter.put("/post/toggleLikes", protectedRoute, toggleLikesOfPost);
contentRouter.post(
  "/post/addCommentsInThePost",
  protectedRoute,
  addCommentsInThePost
);
contentRouter.post(
  "/post/addReplyInTheComment",
  protectedRoute,
  addReplyToPostComment
);
// posts

export default contentRouter;
