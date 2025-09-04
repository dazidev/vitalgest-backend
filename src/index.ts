import './types/express-augment';
import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
//import list from 'express-list-endpoints';

// documentación
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

// se importan las rutas
import { authRoutes, admRoutes } from './presentation';
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
];

app.use(cors({
  origin: ACCEPTED_ORIGINS,
}));

// documentación
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

// las rutas que estará escuchando el servidor
app.use('/api/adm', admRoutes);
app.use('/api/auth', authRoutes);

// middlewares
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT} | Docs: http://localhost:${PORT}/api/docs`);
});