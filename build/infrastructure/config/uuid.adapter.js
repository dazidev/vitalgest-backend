"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binToUuid = exports.uuidToBin = void 0;
const uuid_1 = require("uuid");
const uuidToBin = (uuidStr) => Buffer.from((0, uuid_1.parse)(uuidStr));
exports.uuidToBin = uuidToBin;
const binToUuid = (buf) => (0, uuid_1.stringify)(buf);
exports.binToUuid = binToUuid;
