"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const application_1 = require("../../application");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof application_1.CustomError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }
    console.error("[INTERNAL ERROR]", err);
    return res.status(500).json({
        success: false,
        error: "INTERNAL_SERVER_ERROR",
    });
};
exports.errorHandler = errorHandler;
