import express from "express";
import { AuthMiddleware } from "../../infrastructure";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";

const userRoutes = express.Router();

const userService = new UserService();
const controller = new UserController(userService);

userRoutes.patch(
  "/change/password/:id",
  [AuthMiddleware.validateJWT],
  controller.changePassword.bind(controller),
);

userRoutes.patch(
  "/change/info/:id",
  [AuthMiddleware.validateJWT],
  controller.changeInfo.bind(controller),
);

userRoutes.get(
  "/:id/upload/signature",
  [AuthMiddleware.validateJWT],
  controller.uploadSign.bind(controller),
);
userRoutes.patch(
  "/:id/image/attach",
  [AuthMiddleware.validateJWT],
  controller.attachSignatureImage.bind(controller),
);

export default userRoutes;
