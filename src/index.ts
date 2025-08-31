import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';


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

// las rutas que estará escuchando el servidor
app.use('/auth', authRoutes)
app.use('/adm', admRoutes)

// middlewares
app.use(errorHandler)

// se llama a las varibles de entorno
config()

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})