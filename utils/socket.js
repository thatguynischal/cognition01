import logger from "./logger.js";

export default async function(io) {
    io.on('connection', (socket) => {
        logger.info('A user connected:', socket.id);

        socket.on('disconnect', () => {
            logger.info('User disconnected:', socket.id);
        });
    });
}
