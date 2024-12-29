import {Router} from "express";
import {
    bookingController,
    customerController,
    deleteTableController,
    getTableController,
    newTableController,
    updateTableController
} from "../controllers/table.controller.js";
import {authMiddleware} from "../utils/auth.middleware.js";

const tableRouter = Router();
tableRouter.use(authMiddleware);


tableRouter.post('/create-new-table', newTableController);
tableRouter.get('/table-list', getTableController);
tableRouter.post('/remove-table', deleteTableController);
tableRouter.post('/update-table', updateTableController);
tableRouter.post('/new-customer', customerController);
tableRouter.post('/book-a-table', bookingController);


export default tableRouter;