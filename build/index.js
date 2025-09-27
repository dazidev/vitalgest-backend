"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./types/express-augment");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//import list from 'express-list-endpoints';
// documentación
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./docs/swagger");
// se importan las rutas
const presentation_1 = require("./presentation");
const infrastructure_1 = require("./infrastructure");
// se llama a las varibles de entorno
(0, dotenv_1.config)();
// se inicia la aplicación de express
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.json());
app.disable('x-powered-by');
// modificar el origen de las solicitudes
const ACCEPTED_ORIGINS = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    /\.vercel\.app$/, // cualquier subdominio de vercel.app
    /\.vitalgest-backend\.vercel\.app$/,
];
app.use((0, cors_1.default)({
    origin: ACCEPTED_ORIGINS,
}));
// documentación
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.get('/api/docs.json', (_req, res) => res.json(swagger_1.swaggerSpec));
// las rutas que estará escuchando el servidor
app.use('/api/adm', presentation_1.admRoutes);
app.use('/api/auth', presentation_1.authRoutes);
// middlewares
app.use(infrastructure_1.errorHandler);
exports.default = app;
if (!process.env.VERCEL) {
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => {
        console.log(`API: http://localhost:${PORT} | Docs: http://localhost:${PORT}/api/docs`);
    });
}
