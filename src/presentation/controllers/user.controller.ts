import { Request, Response, NextFunction } from "express";
import { ERROR_CODES } from "../../domain";
import { CustomError, UserEntityDto } from "../../application";
import { UserService } from "../services/user.service";
import { config } from "dotenv";
import { r2 } from "../../infrastructure/services/cloudflare-r2.service";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

config();

// R2 declarations
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

  changePassword(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { currentPass, newPass } = req.body;

    const [error, _userEntityDto] = UserEntityDto.changePassword({
      id,
      ...req.body,
    });
    if (error) throw CustomError.badRequest(error);

    this.userService
      .changePassword(id, currentPass!, newPass!)
      .then((user) => res.status(200).json(user))
      .catch((error) => next(this.handleError(error)));
  }

  changeInfo(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { name, lastname } = req.body;
    const [error, _userEntityDto] = UserEntityDto.edit({ id, name, lastname });
    if (error) throw CustomError.badRequest(error);

    this.userService
      .changeInfo(id, name, lastname)
      .then((user) => res.status(200).json(user))
      .catch((error) => next(this.handleError(error)));
  }

  uploadSign = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { mime, ext, size } = req.body;

    //validaciones
    const allow = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allow.includes(mime)) return CustomError.badRequest("INVALID_MIME");
    if (!ext || ext.length > 8) return CustomError.badRequest("INVALID_EXT");
    if (!size || size > MAX_BYTES)
      return CustomError.badRequest("INVALID_SIZE");

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
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const { key } = req.body;

    if (!id) throw this.handleError(ERROR_CODES.MISSING_USER_ID);
    if (!key) throw this.handleError(ERROR_CODES.MISSING_KEY);

    r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key })).catch(() =>
      next(CustomError.badRequest("OBJECT_NOT_FOUND")),
    );

    this.userService
      .attachSignatureImage(id, key)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.badRequest(error)));
  };
}
