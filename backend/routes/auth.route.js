import express from "express";

import {
  register,
  logIn,
  logOut,
  googleSignIn,
} from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("photoUrl"), register);
authRouter.post("/login", logIn);
authRouter.post("/logout", logOut);
authRouter.post("/google", googleSignIn);

export default authRouter;
