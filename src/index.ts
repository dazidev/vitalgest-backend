import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import list from 'express-list-endpoints';

// documentación
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';


// se importan las rutas
import { authRoutes, admRoutes } from './presentation';
import { errorHandler } from './infrastructure';


// se inicia la aplicación de express
const app = express();
app.use(express.json());
app.disable('x-powered-by');

// modificar el origen de las solicitudes
const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
]

app.use(cors({
  origin: ACCEPTED_ORIGINS,
}));

// documentación
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

// las rutas que estará escuchando el servidor
app.use('/adm', admRoutes)
app.use('/auth', authRoutes)

// middlewares
app.use(errorHandler)

// se llama a las varibles de entorno
config()

const PORT = process.env.PORT

console.log(list(app));
app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT} | Docs: http://localhost:${PORT}/docs`);
})