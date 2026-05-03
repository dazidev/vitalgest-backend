import express from "express";
import { AuthMiddleware } from "../../infrastructure";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";

const userRoutes = express.Router();

const userService = new UserService();
const controller = new UserController(userService);

userRoutes.post(
  "/change/password/:id",
  [AuthMiddleware.validateJWT],
  controller.changePassword.bind(controller),
);

userRoutes.post(
  "/change/info/:id",
  [AuthMiddleware.validateJWT],
  controller.changeInfo.bind(controller),
);

userRoutes.post(
  "/:id/upload/signature",
  [AuthMiddleware.validateJWT],
  controller.uploadSign.bind(controller),
);
userRoutes.post(
  "/:id/image/attach",
  [AuthMiddleware.validateJWT],
  controller.attachSignatureImage.bind(controller),
);

export default userRoutes;
