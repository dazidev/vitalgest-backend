import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

const authRoutes = express.Router();

const authService = new AuthService();
const controller = new AuthController(authService);

authRoutes.post('/login-user', controller.loginUser);
authRoutes.post('/refresh-token', controller.newAccessToken);

export default authRoutes;