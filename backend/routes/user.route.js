import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import {
  getCurrentLoggedInUser,
  getUserChannel,
} from "../controllers/user.controller.js";
import { createChannel } from "../controllers/user.controller.js";
import uploads from "../middlewares/multer.js";
const userRouter = express.Router();

userRouter.get("/", protectedRoute, getCurrentLoggedInUser);
userRouter.get("/get-channel", protectedRoute, getUserChannel);
userRouter.post(
  "/create-channel",
  protectedRoute,
  uploads.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createChannel
);

export default userRouter;
