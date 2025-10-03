"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardsRoutes = exports.delegationsRoutes = exports.admRoutes = exports.authRoutes = void 0;
// rutas
var auth_routes_1 = require("./routes/auth.routes");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(auth_routes_1).default; } });
var adm_routes_1 = require("./routes/adm.routes");
Object.defineProperty(exports, "admRoutes", { enumerable: true, get: function () { return __importDefault(adm_routes_1).default; } });
var delegations_routes_1 = require("./routes/delegations.routes");
Object.defineProperty(exports, "delegationsRoutes", { enumerable: true, get: function () { return __importDefault(delegations_routes_1).default; } });
var guards_routes_1 = require("./routes/guards.routes");
Object.defineProperty(exports, "guardsRoutes", { enumerable: true, get: function () { return __importDefault(guards_routes_1).default; } });
// controladores
__exportStar(require("./controllers/adm.controller"), exports);
__exportStar(require("./controllers/auth.controller"), exports);
