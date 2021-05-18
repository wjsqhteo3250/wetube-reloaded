import express from "express";
import {edit, remove, see, logout} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/logout", logout);
userRouter.get("/:id", see);



export default userRouter;