import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
import express from "express";
import { AdmController } from "../controllers/adm.controller";
import { AdmService } from "../services/adm.service";
import { AuthMiddleware } from "../../infrastructure";

const admRoutes = express.Router();

const admService = new AdmService();
const controller = new AdmController(admService);

admRoutes.post(
  "/create/user",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.createUser.bind(controller),
);

admRoutes.put(
  "/edit/user/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.editUser.bind(controller),
);

admRoutes.delete(
  "/delete/user/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.deleteUser.bind(controller),
);

admRoutes.get(
  "/get-all/users",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.getAllUsers.bind(controller),
);

admRoutes.put(
  "/change-password/user/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.changePasswordUser.bind(controller),
);

admRoutes.get(
  "/get/user/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.getUserById.bind(controller),
);

export default admRoutes;
