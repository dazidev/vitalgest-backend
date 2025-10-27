import express, { Request, Response, NextFunction } from 'express';
import { /*AuthMiddleware,*/ createQuestionsSeed, createSeed, /*RankMiddleware*/ } from '../../../infrastructure';
import { CustomError } from '../../../application';
import { ERROR_CODES } from '../../../domain';

const devRoutes = express.Router();

devRoutes.post('/seed',
  //[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')], 
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const seed = await createSeed()
      if (!seed) return next(CustomError.badRequest(ERROR_CODES.INSERT_FAILED))
  
      return res.status(201).json(seed)
    } catch (error) {
      return next(CustomError.badRequest(ERROR_CODES.UNKNOWN_DB_ERROR))
    }
  },
)

devRoutes.post('/seed-questions',
  //[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')], 
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const seed = await createQuestionsSeed()
      if (!seed) return next(CustomError.badRequest(ERROR_CODES.INSERT_FAILED))
  
      return res.status(201).json(seed)
    } catch (error) {
      return next(CustomError.badRequest(ERROR_CODES.UNKNOWN_DB_ERROR))
    }
  },
)

//devRoutes.post('/refresh/token',);

export default devRoutes;