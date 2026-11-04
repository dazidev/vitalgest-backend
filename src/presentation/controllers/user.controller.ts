import { Request, Response, NextFunction } from "express";
import { ERROR_CODES } from "../../domain";
import { CustomError, UserEntityDto } from "../../application";
import { UserService } from "../services/user.service";
import { config } from "dotenv";
import { r2 } from "../../infrastructure/services/cloudflare-r2.service";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

config();

const BUCKET = process.env.R2_BUCKET!;
const MAX_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 5_000_000);

export class UserController {
  constructor(public readonly userService: UserService) {}

  private handleError = (error: string) => {
    if (error === ERROR_CODES.UNKNOWN_ERROR)
      return CustomError.internalServer(error);
    if (error === ERROR_CODES.UNKNOWN_DB_ERROR)
      return CustomError.internalServer(error);
    if (error === ERROR_CODES.TOO_MANY_REQUESTS)
      return CustomError.tooManyRequests(error);
    return CustomError.badRequest(error);
  };

  changePassword(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    if (id !== userId) {
      next(new CustomError(403, ERROR_CODES.UNAUTHORIZED_RANK));
      return;
    }

    const { currentPass, newPass } = req.body;

    const [error] = UserEntityDto.changePassword({
      id,
      currentPass,
      newPass,
    });

    if (error) throw CustomError.badRequest(error);

    this.userService
      .changePassword(id, currentPass, newPass)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  changeInfo(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    if (id !== userId) {
      next(new CustomError(403, ERROR_CODES.UNAUTHORIZED_RANK));
      return;
    }

    const { name, lastname } = req.body;

    const [error] = UserEntityDto.changeInfo({
      id,
      name,
      lastname,
    });

    if (error) throw CustomError.badRequest(error);

    this.userService
      .changeInfo(id, name, lastname)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  uploadSign = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    if (id !== userId) {
      next(new CustomError(403, ERROR_CODES.UNAUTHORIZED_RANK));
      return;
    }
    const { mime, ext, size } = req.body;

    //validaciones
    const allow = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allow.includes(mime)) {
      next(CustomError.badRequest("INVALID_MIME"));
      return;
    }
    if (typeof ext !== "string" || !/^[a-zA-Z0-9]{1,8}$/.test(ext)) {
      next(CustomError.badRequest("INVALID_EXT"));
      return;
    }
    if (!Number.isSafeInteger(size) || size <= 0 || size > MAX_BYTES) {
      next(CustomError.badRequest("INVALID_SIZE"));
      return;
    }

    const key = `users/signatures/images/${id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: mime,
      // Opcional: limitar tamaño esperado
      // ContentLength: size,
    });

    return getSignedUrl(r2, cmd, { expiresIn: 600 })
      .then((uploadUrl) => {
        const payload = {
          success: true,
          data: {
            uploadUrl,
            key,
          },
        };
        return res.json(payload);
      })
      .catch((error) => next(CustomError.badRequest(error)));
  };

  attachSignatureImage = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    const { key } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    if (id !== userId) {
      next(new CustomError(403, ERROR_CODES.UNAUTHORIZED_RANK));
      return;
    }

    if (typeof key !== "string" || !key.trim()) {
      next(CustomError.badRequest(ERROR_CODES.MISSING_KEY));
      return;
    }

    const expectedPrefix = `users/signatures/images/${id}/`;

    if (!key.startsWith(expectedPrefix)) {
      next(CustomError.badRequest("INVALID_SIGNATURE_KEY"));
      return;
    }

    try {
      await r2.send(
        new HeadObjectCommand({
          Bucket: BUCKET,
          Key: key,
        }),
      );

      const response = await this.userService.attachSignatureImage(id, key);

      res.json(response);
    } catch (error) {
      next(CustomError.badRequest("SIGNATURE_UPDATE_FAILED"));
    }
  };
}
