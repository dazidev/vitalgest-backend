import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
import express from "express";
import { AuthMiddleware } from "../../infrastructure";

import { QuestionsService } from "../services/questions.service";
import { QuestionsController } from "../controllers/questions.controller";

const questionsRoutes = express.Router();

const service = new QuestionsService();
const controller = new QuestionsController(service);

//* CATEGORIES

questionsRoutes.get(
  "/categories",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.getCategories.bind(controller),
);

questionsRoutes.get(
  "/categories/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.getCategory.bind(controller),
);

questionsRoutes.post(
  "/categories",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.createCategory.bind(controller),
);

questionsRoutes.put(
  "/categories/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.editCategory.bind(controller),
);

questionsRoutes.delete(
  "/categories/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.deleteCategory.bind(controller),
);

//* SUBCATEGORIES

questionsRoutes.get(
  "/subcategories",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.getSubcategories.bind(controller),
);

questionsRoutes.get(
  "/subcategories/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.getSubcategory.bind(controller),
);

questionsRoutes.post(
  "/subcategories",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.createSubcategory.bind(controller),
);

questionsRoutes.put(
  "/subcategories/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.editSubcategory.bind(controller),
);

questionsRoutes.delete(
  "/subcategories/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.deleteSubcategory.bind(controller),
);

//* QUESTIONS

questionsRoutes.get(
  "/",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.getQuestions.bind(controller),
);

questionsRoutes.get(
  "/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.getQuestion.bind(controller),
);

questionsRoutes.post(
  "/",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.createQuestion.bind(controller),
);

questionsRoutes.put(
  "/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.editQuestion.bind(controller),
);

questionsRoutes.delete(
  "/:id",
  [AuthMiddleware.validateJWT],
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.deleteQuestion.bind(controller),
);

export default questionsRoutes;
