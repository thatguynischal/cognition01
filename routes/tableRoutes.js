import {Router} from "express";
import {
    deleteTableController,
    getTableController,
    newTableController,
    updateTableController
} from "../controllers/table.controller.js";

const tableRouter = Router();

tableRouter.post('/create-new-table', newTableController);
tableRouter.get('/table-list', getTableController);
tableRouter.post('/remove-table', deleteTableController);
tableRouter.post('/update-table', updateTableController);


export default tableRouter;