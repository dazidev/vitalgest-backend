import { ERROR_CODES, LogEntities } from "../../domain";
import { regularExp } from "../../infrastructure/config/regular-exp";
import { PaginationDto } from "./pagination.dto";

type FindLogsDtoProps = {
  limit: number;
  offset: number;
  entity?: string;
  action?: string;
  userId?: string;
  userSearch?: string;
  from?: Date;
  to?: Date;
};

export class FindLogsDto {
  readonly limit!: number;
  readonly offset!: number;
  readonly entity?: string;
  readonly action?: string;
  readonly userId?: string;
  readonly userSearch?: string;
  readonly from?: Date;
  readonly to?: Date;

  private constructor(props: FindLogsDtoProps) {
    Object.assign(this, props);
  }

  private static parseDate(value: string, end = false): Date | null {
    const onlyDate = /^\d{4}-\d{2}-\d{2}$/.test(value);

    const normalized = onlyDate
      ? `${value}T${end ? "23:59:59.999" : "00:00:00.000"}Z`
      : value;

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) return null;

    if (onlyDate && date.toISOString().slice(0, 10) !== value) {
      return null;
    }

    return date;
  }

  static validate(object: Record<string, unknown>): [string?, FindLogsDto?] {
    const {
      limit = "20",
      offset = "0",
      entity,
      action,
      userId,
      userSearch,
      from,
      to,
    } = object;

    const [paginationError, paginationDto] = PaginationDto.validate({
      limit,
      offset,
    });

    if (paginationError) return [paginationError];

    const parsedLimit = paginationDto!.limit!;
    const parsedOffset = paginationDto!.offset!;

    if (parsedLimit > 100 || !Number.isSafeInteger(parsedLimit)) {
      return [ERROR_CODES.INVALID_LIMIT];
    }

    if (!Number.isSafeInteger(parsedOffset)) {
      return [ERROR_CODES.INVALID_OFFSET];
    }

    const validEntities: readonly string[] = Object.values(LogEntities);

    if (
      entity !== undefined &&
      (typeof entity !== "string" || !validEntities.includes(entity))
    ) {
      return [ERROR_CODES.INVALID_LOG_ENTITY];
    }

    if (
      action !== undefined &&
      (typeof action !== "string" || action.trim().length === 0)
    ) {
      return [ERROR_CODES.INVALID_LOG_ACTION];
    }

    if (
      userId !== undefined &&
      (typeof userId !== "string" || !regularExp.uuid.test(userId))
    ) {
      return [ERROR_CODES.INVALID_LOG_USER_ID];
    }

    if (
      userSearch !== undefined &&
      (typeof userSearch !== "string" ||
        userSearch.trim().length === 0 ||
        userSearch.trim().length > 100)
    ) {
      return [ERROR_CODES.INVALID_LOG_USER_SEARCH];
    }

    if (
      (from !== undefined && typeof from !== "string") ||
      (to !== undefined && typeof to !== "string")
    ) {
      return [ERROR_CODES.INVALID_LOG_DATE];
    }

    const fromDate =
      typeof from === "string" ? this.parseDate(from) : undefined;

    const toDate =
      typeof to === "string" ? this.parseDate(to, true) : undefined;

    if ((from !== undefined && !fromDate) || (to !== undefined && !toDate)) {
      return [ERROR_CODES.INVALID_LOG_DATE];
    }

    if (fromDate && toDate && fromDate > toDate) {
      return [ERROR_CODES.INVALID_LOG_DATE_RANGE];
    }

    return [
      undefined,
      new FindLogsDto({
        limit: parsedLimit,
        offset: parsedOffset,
        entity: entity as string | undefined,
        action: action as string | undefined,
        userId: userId as string | undefined,
        userSearch: (userSearch as string | undefined)?.trim(),
        from: fromDate ?? undefined,
        to: toDate ?? undefined,
      }),
    ];
  }
}
