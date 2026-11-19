import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
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
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.changePassword.bind(controller),
);

userRoutes.patch("/change/info/:id", PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.changeInfo.bind(controller));

userRoutes.post(
  "/:id/upload/signature",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.uploadSign.bind(controller),
);
userRoutes.patch(
  "/:id/image/attach",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.attachSignatureImage.bind(controller),
);

export default userRoutes;
