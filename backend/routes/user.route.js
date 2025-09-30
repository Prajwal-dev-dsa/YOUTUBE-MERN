import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { getCurrentLoggedInUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", protectedRoute, getCurrentLoggedInUser);

export default userRouter;
