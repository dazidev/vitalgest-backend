import { Request, Response, NextFunction } from "express";
import { CustomError, FindLogsDto } from "../../application";
import { LogsService } from "../services/logs.service";

export class LogsController {
  constructor(public readonly logsService: LogsService) {}

  getLogs(req: Request, res: Response, next: NextFunction): void {
    const { limit, offset, entity, action, userId, userSearch, from, to } =
      req.query;

    const [error, findLogsDto] = FindLogsDto.validate({
      limit,
      offset,
      entity,
      action,
      userId,
      userSearch,
      from,
      to,
    });

    if (error) {
      next(CustomError.badRequest(error));
      return;
    }

    this.logsService
      .findAll(findLogsDto!)
      .then((response) => res.json(response))
      .catch((error) => {
        if (typeof error === "string") {
          return next(CustomError.badRequest(error));
        }

        return next(error);
      });
  }

  getFilters(_req: Request, res: Response, next: NextFunction): void {
    try {
      const filters = this.logsService.getFilters();

      res.json({
        success: true,
        data: filters,
      });
    } catch (error) {
      next(error);
    }
  }
}
