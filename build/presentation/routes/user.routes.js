"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const infrastructure_1 = require("../../infrastructure");
const user_service_1 = require("../services/user.service");
const user_controller_1 = require("../controllers/user.controller");
const userRoutes = express_1.default.Router();
const userService = new user_service_1.UserService();
const controller = new user_controller_1.UserController(userService);
userRoutes.patch("/change/password/:id", [infrastructure_1.AuthMiddleware.validateJWT], controller.changePassword.bind(controller));
userRoutes.patch("/change/info/:id", [infrastructure_1.AuthMiddleware.validateJWT], controller.changeInfo.bind(controller));
userRoutes.get("/:id/upload/signature", [infrastructure_1.AuthMiddleware.validateJWT], controller.uploadSign.bind(controller));
userRoutes.patch("/:id/image/attach", [infrastructure_1.AuthMiddleware.validateJWT], controller.attachSignatureImage.bind(controller));
exports.default = userRoutes;
