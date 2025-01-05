import app from './app.js';
import config from './utils/config.js';
import logger from './utils/logger.js';
import http from "http";
import {Server} from "socket.io";
import Socket from "./utils/socket.js";

const server = http.createServer(app);
const io = new Server(server, {
   cors: {
       origin: '*',
   }

});

server.listen(config.PORT, () => {
    Socket(io);
    logger.info(`Server running on port ${config.PORT}`);
});

