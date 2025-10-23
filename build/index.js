"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./types/express-augment");
require("./docs/swagger");
require("./docs/adm.docs");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const node_fs_1 = __importDefault(require("node:fs"));
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
app.use('/api/docs', swagger_ui_express_1.default.serve);
app.get('/api/docs', (_req, res) => {
    res.type('html').send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>VitalGest API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
  <script>
  window.onload = () => {
    const ui = SwaggerUIBundle({
      url: '/api/docs.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout',
      validatorUrl: null,
      docExpansion: 'list',
      defaultModelsExpandDepth: -1
    });
    window.ui = ui;
  }
  </script>
</body>
</html>`);
});
// Endpoint del JSON
app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swagger_1.swaggerSpec);
});
app.get('/api/docs.debug', (_req, res) => {
    const f = path_1.default.resolve('build/docs/adm.docs.js');
    res.json({
        cwd: process.cwd(),
        exists: node_fs_1.default.existsSync(f),
        file: f
    });
});
// las rutas que estará escuchando el servidor
app.use('/api/adm', presentation_1.admRoutes);
app.use('/api/auth', presentation_1.authRoutes);
app.use('/api/delegations', presentation_1.delegationsRoutes);
app.use('/api/guards', presentation_1.guardsRoutes);
app.use('/api/ambulances', presentation_1.ambulancesRoutes);
// rutas que funcionan solo en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use('/api/dev', presentation_1.devRoutes);
}
// middlewares
app.use(infrastructure_1.errorHandler);
exports.default = app;
if (!process.env.VERCEL) {
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => {
        console.log(`API: http://localhost:${PORT} | Docs: http://localhost:${PORT}/api/docs`);
    });
}
