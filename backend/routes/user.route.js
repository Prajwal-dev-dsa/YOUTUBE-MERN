import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import {
  getCurrentLoggedInUser,
  getUserChannel,
  getAllChannels,
  toggleSubscribers,
  createChannel,
  customizeChannel,
  getSubscribedContentData,
} from "../controllers/user.controller.js";
import uploads from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/", protectedRoute, getCurrentLoggedInUser);
userRouter.get("/get-channel", protectedRoute, getUserChannel);
userRouter.get("/get-all-channels", protectedRoute, getAllChannels);
userRouter.get(
  "/get-subscribed-content-data",
  protectedRoute,
  getSubscribedContentData
);
userRouter.post(
  "/create-channel",
  protectedRoute,
  uploads.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createChannel
);
userRouter.post(
  "/customize-channel",
  protectedRoute,
  uploads.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  customizeChannel
);
userRouter.post("/toggle-subscribers", protectedRoute, toggleSubscribers);

export default userRouter;
