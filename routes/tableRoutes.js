import {Router} from "express";
import {
    bookingController,
    checkoutController,
    customerController,
    deleteTableController,
    getTableController, infoController,
    newTableController,
    updateTableController
} from "../controllers/table.controller.js";
import {authMiddleware} from "../utils/auth.middleware.js";
import {customerCheckout} from "../services/table.service.js";

const tableRouter = Router();
tableRouter.use(authMiddleware);


tableRouter.post('/create-new-table', newTableController);
tableRouter.get('/table-list', getTableController);
tableRouter.post('/remove-table', deleteTableController);
tableRouter.post('/update-table', updateTableController);
tableRouter.post('/new-customer', customerController);
tableRouter.post('/book-a-table', bookingController);
tableRouter.post('/customer-checkout', checkoutController);
tableRouter.get('/general-tables-info', infoController);


export default tableRouter;