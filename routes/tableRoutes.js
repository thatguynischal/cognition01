import {Router} from "express";
import {deleteTableController, getTableController, newTableController} from "../controllers/table.controller.js";

const tableRouter = Router();

tableRouter.post('/create-new-table', newTableController);
tableRouter.get('/table-list', getTableController);
tableRouter.post('/remove-table', deleteTableController);


export default tableRouter;