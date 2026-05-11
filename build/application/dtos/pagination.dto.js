"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = void 0;
const domain_1 = require("../../domain");
class PaginationDto {
    constructor(props) {
        Object.assign(this, props);
    }
    static validate(object) {
        const { limit, offset, role } = object;
        const filterLimit = typeof limit === "string" ? limit : undefined;
        const filterOffset = typeof offset === "string" ? offset : undefined;
        const filterRole = typeof role === "string" ? role : undefined;
        let limitNumber;
        let offsetNumber;
        if (filterLimit !== undefined) {
            limitNumber = Number(filterLimit);
            if (!Number.isInteger(limitNumber) || limitNumber <= 0) {
                return [domain_1.ERROR_CODES.INVALID_LIMIT];
            }
        }
        if (filterOffset !== undefined) {
            offsetNumber = Number(filterOffset);
            if (!Number.isInteger(offsetNumber) || offsetNumber < 0) {
                return [domain_1.ERROR_CODES.INVALID_OFFSET];
            }
        }
        if (filterRole !== undefined && !domain_1.ROLE_LIST.includes(filterRole)) {
            return [domain_1.ERROR_CODES.INVALID_ROLE];
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
exports.PaginationDto = PaginationDto;
