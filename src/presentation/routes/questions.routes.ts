import express from "express";
import { AuthMiddleware, RankMiddleware } from "../../infrastructure";

import { QuestionsService } from "../services/questions.service";
import { QuestionsController } from "../controllers/questions.controller";

const questionsRoutes = express.Router();

const service = new QuestionsService();
const controller = new QuestionsController(service);

//* CATEGORIES

questionsRoutes.get(
  "/categories",
  [AuthMiddleware.validateJWT, RankMiddleware.validate("admin")],
  controller.getCategories.bind(controller),
);

questionsRoutes.get(
  "/categories/:id",
  [AuthMiddleware.validateJWT, RankMiddleware.validate("admin")],
  controller.getCategory.bind(controller),
);

questionsRoutes.post(
  "/categories",
  [AuthMiddleware.validateJWT, RankMiddleware.validate("admin")],
  controller.createCategory.bind(controller),
);

questionsRoutes.put(
  "/categories/:id",
  [AuthMiddleware.validateJWT, RankMiddleware.validate("admin")],
  controller.editCategory.bind(controller),
);

questionsRoutes.delete(
  "/categories/:id",
  [AuthMiddleware.validateJWT, RankMiddleware.validate("admin")],
  controller.deleteCategory.bind(controller),
);

export default questionsRoutes;
