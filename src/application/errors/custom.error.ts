export class CustomError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string
  ) {
    super(message);
  }

  static from(error: unknown): CustomError {
    if (error instanceof CustomError) return error;
    if (error === "DELEGATION_ACCESS_DENIED" || error === "DELEGATION_MISMATCH" || error === "ADMIN_ROLE_RESTRICTED") {
      return new CustomError(403, error);
    }
    return CustomError.badRequest(typeof error === "string" ? error : "UNKNOWN_ERROR");
  }

  static badRequest(message: string) {
    if (message === "DELEGATION_ACCESS_DENIED" || message === "DELEGATION_MISMATCH" || message === "ADMIN_ROLE_RESTRICTED") return new CustomError(403, message);
    return new CustomError(400, message);
  }

  static unauthorized(message: string) {
    return new CustomError(401, message);
  }

  static notFound(message: string) {
    return new CustomError(404, message);
  }

  static internalServer(message: string) {
    return new CustomError(500, message);
  }

  static tooManyRequests(message: string) {
    return new CustomError(429, message);
  }
}
