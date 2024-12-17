import mongoose from 'mongoose'
import logger from "./utils/logger.js";
import config from "./utils/config.js";

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

export const connection = async () => mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })
