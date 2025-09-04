import { Request, Response, NextFunction } from "express";
import { AuthControllerInterface, ERROR_CODES } from "../../domain";
import { AuthService } from "../services/auth.service";
import { CustomError, UserEntityDto } from "../../application";
import { REFRESH_COOKIE_NAME, setRefreshCookie } from "../../infrastructure";

export class AuthController implements AuthControllerInterface {

  constructor (
      public readonly authService: AuthService,
    ) {}

  private handleError = (error: {code: string}) => {
    if (error.code === ERROR_CODES.UNKNOWN_ERROR) return CustomError.internalServer(error.code)
    if (error.code === ERROR_CODES.TOO_MANY_REQUESTS) return CustomError.tooManyRequests(error.code)
    return CustomError.badRequest(error.code)
  }  

  loginUser(req: Request, res: Response, next: NextFunction): void {
    const [error, userEntityDto] = UserEntityDto.login(req.body)
    if (error) throw CustomError.badRequest(error)

    this.authService.loginUser(userEntityDto!)
      .then((response) => {
        const { refreshToken, ...dataResponse } = response;
        setRefreshCookie(res, refreshToken);
        res.json(dataResponse);
      })
      .catch((error) => next(this.handleError(error)))
  }
  
  newAccessToken(req: Request, res: Response, next: NextFunction): void {
    const refreshTokenReq = req.signedCookies?.[REFRESH_COOKIE_NAME];
    if (!refreshTokenReq) throw CustomError.badRequest(ERROR_CODES.NO_TOKEN_PROVIDED);

    this.authService.newAccessToken(refreshTokenReq!)
      .then((response) => {
        const { accessToken, refreshToken } = response;
        setRefreshCookie(res, refreshToken);
        res.json({
          success: "true",
          accessToken: accessToken
        });
      })
      .catch((error) => next(this.handleError(error)))
  }
}