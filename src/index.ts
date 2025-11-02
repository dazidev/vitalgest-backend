import './types/express-augment';
import './docs/swagger'
import './docs/adm.docs'
// import 'undici';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'node:fs';
//import list from 'express-list-endpoints';

// documentación
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

// se importan las rutas
import { authRoutes, admRoutes, delegationsRoutes, guardsRoutes, devRoutes, ambulancesRoutes, shiftRoutes, checklistsRoutes } from './presentation';
import { errorHandler } from './infrastructure';


// se llama a las varibles de entorno
config();

// se inicia la aplicación de express
const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json());
app.disable('x-powered-by');

// modificar el origen de las solicitudes
const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  /\.vercel\.app$/,             // cualquier subdominio de vercel.app
  /\.vitalgest-backend\.vercel\.app$/,
];

app.use(cors({
  origin: ACCEPTED_ORIGINS,
}));

// documentación
app.use('/api/docs', swaggerUi.serve);
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
  res.json(swaggerSpec);
});

app.get('/api/docs.debug', (_req, res) => {
  const f = path.resolve('build/docs/adm.docs.js');
  res.json({
    cwd: process.cwd(),
    exists: fs.existsSync(f),
    file: f
  });
});


// las rutas que estará escuchando el servidor
app.use('/api/adm', admRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/delegations', delegationsRoutes);
app.use('/api/guards', guardsRoutes);
app.use('/api/ambulances', ambulancesRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/checklists', checklistsRoutes);

// para ver las imagenes
app.use('/uploads', express.static(path.resolve('uploads'), {
  // cache opcional
  maxAge: '7d',
  etag: true,
  setHeaders: (res) => res.setHeader('Cache-Control', 'public, max-age=604800')
}));



// rutas que funcionan solo en desarrollo
if (process.env.NODE_ENV === 'development'){
  app.use('/api/dev', devRoutes);
}

// middlewares
app.use(errorHandler);

export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`API: http://localhost:${PORT} | Docs: http://localhost:${PORT}/api/docs`);
  });
}