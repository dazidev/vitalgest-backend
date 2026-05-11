import { ERROR_CODES, ROLE_LIST } from "../../domain";

type PaginationDtoProps = {
  limit?: number;
  offset?: number;
  role?: string;
};

export class PaginationDto {
  readonly limit?: number;
  readonly offset?: number;
  readonly role?: string;

  private constructor(props: PaginationDtoProps) {
    Object.assign(this, props);
  }

  static validate(object: { [key: string]: any }): [string?, PaginationDto?] {
    const { limit, offset, role } = object;

    const filterLimit = typeof limit === "string" ? limit : undefined;
    const filterOffset = typeof offset === "string" ? offset : undefined;
    const filterRole = typeof role === "string" ? role : undefined;

    let limitNumber: number | undefined;
    let offsetNumber: number | undefined;

    if (filterLimit !== undefined) {
      limitNumber = Number(filterLimit);

      if (!Number.isInteger(limitNumber) || limitNumber <= 0) {
        return [ERROR_CODES.INVALID_LIMIT];
      }
    }

    if (filterOffset !== undefined) {
      offsetNumber = Number(filterOffset);

      if (!Number.isInteger(offsetNumber) || offsetNumber < 0) {
        return [ERROR_CODES.INVALID_OFFSET];
      }
    }

    if (filterRole !== undefined && !ROLE_LIST.includes(filterRole)) {
      return [ERROR_CODES.INVALID_ROLE];
    }

    return [
      undefined,
      new PaginationDto({
        limit: limitNumber,
        offset: offsetNumber,
        role: filterRole,
      }),
    ];
  }
}
