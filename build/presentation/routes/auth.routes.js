"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_service_1 = require("../services/auth.service");
const authRoutes = express_1.default.Router();
const authService = new auth_service_1.AuthService();
const controller = new auth_controller_1.AuthController(authService);
authRoutes.post("/login/user", controller.loginUser.bind(controller));
authRoutes.post("/refresh/token", controller.newAccessToken.bind(controller));
exports.default = authRoutes;
