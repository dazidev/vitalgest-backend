import { ERROR_CODES, LogEntities } from "../../domain";
import { regularExp } from "../../infrastructure/config/regular-exp";

type LogDtoProps = {
  userId: string | null;
  affected: string | null;
  entity: string;
  action: string;
  description: string;
};

export class LogEntityDto {
  readonly userId: string | null;
  readonly affected: string | null;
  readonly entity: string;
  readonly action: string;
  readonly description: string;

  private constructor(props: LogDtoProps) {
    this.userId = props.userId;
    this.affected = props.affected;
    this.entity = props.entity;
    this.action = props.action;
    this.description = props.description;
  }

  static create(object: Record<string, unknown>): [string?, LogEntityDto?] {
    const { userId, affected, entity, action, description } = object;

    if (
      userId !== undefined &&
      userId !== null &&
      (typeof userId !== "string" || !regularExp.uuid.test(userId))
    ) {
      return [ERROR_CODES.INVALID_LOG_USER_ID];
    }

    if (
      affected !== undefined &&
      affected !== null &&
      (typeof affected !== "string" ||
        affected.trim().length === 0 ||
        affected.length > 100)
    ) {
      return [ERROR_CODES.INVALID_LOG_AFFECTED];
    }

    const validEntities: readonly string[] = Object.values(LogEntities);

    if (typeof entity !== "string" || !validEntities.includes(entity)) {
      return [ERROR_CODES.INVALID_LOG_ENTITY];
    }

    if (typeof action !== "string" || action.trim().length === 0) {
      return [ERROR_CODES.INVALID_LOG_ACTION];
    }

    if (
      typeof description !== "string" ||
      description.trim().length === 0 ||
      description.length > 2000
    ) {
      return [ERROR_CODES.INVALID_LOG_DESCRIPTION];
    }

    return [
      undefined,
      new LogEntityDto({
        userId: (userId as string | null) ?? null,
        affected: (affected as string | null)?.trim() ?? null,
        entity,
        action: action.trim(),
        description: description.trim(),
      }),
    ];
  }
}
