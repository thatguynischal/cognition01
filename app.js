import express from 'express';
import cors from 'cors';
import config from './utils/config.js';
const app = express();
import middleware from './utils/middleware.js';
import logger from './utils/logger.js';
import mongoose from 'mongoose'
import authRouter from "./routes/authRoutes.js";

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })


app.use(cors());
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/', authRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app;
