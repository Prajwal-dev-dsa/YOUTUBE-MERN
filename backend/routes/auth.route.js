import express from "express";

import { register, logIn, logOut } from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("photoUrl"), register);
authRouter.post("/login", logIn);
authRouter.post("/logout", logOut);

export default authRouter;
