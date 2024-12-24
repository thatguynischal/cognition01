import {Router} from "express";
import {newTableController, getTable} from "../controllers/table.controller.js";

const tableRouter = Router();

tableRouter.post('/create-new-table', newTableController);
tableRouter.get('/table-list', getTable);

export default tableRouter;