import { Role } from "../../domain";
import { PermissionMiddleware } from "./permission.middleware";

/** Compatibility name: callers must enumerate every permitted role. */
export class RankMiddleware {
  static validate(...roles: Role[]) {
    return PermissionMiddleware.allow(...roles);
  }
}
