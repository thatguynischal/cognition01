import http from 'http';
import { Server } from 'socket.io';
import app from './app.js'; // Import your Express app
import config from './utils/config.js';
import logger from './utils/logger.js';
import Socket from './utils/socket.js'; // Import your Socket.IO setup

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (adjust as needed for production)
    },
});

// Attach io to the app object
app.set('io', io);

// Set up Socket.IO connection handling
Socket(io);

// Start the server
server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});