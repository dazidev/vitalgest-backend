import express from "express";
import { AuthMiddleware } from "../../infrastructure";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";

const userRoutes = express.Router();

const userService = new UserService();
const controller = new UserController(userService);

//* Verificar autenticación de todas las rutas
userRoutes.use(AuthMiddleware.validateJWT);

userRoutes.patch(
  "/change/password/:id",
  controller.changePassword.bind(controller),
);

userRoutes.patch("/change/info/:id", controller.changeInfo.bind(controller));

userRoutes.post(
  "/:id/upload/signature",
  controller.uploadSign.bind(controller),
);
userRoutes.patch(
  "/:id/image/attach",
  controller.attachSignatureImage.bind(controller),
);

export default userRoutes;
