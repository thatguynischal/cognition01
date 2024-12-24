import {createTable, getAllTables} from '../services/table.service.js';
import helpers from '../utils/helpers.js';

export const newTableController = async (req, res) => {
    try {
        const name = req.body.name;
        await createTable(name);
        return helpers.sendResponse(res, "success", 201, "Table created successfully.");
    } catch (error) {
        console.error(error);
        if (error.status && error.message) {
            return helpers.sendResponse(res, "error", error.status, error.message);
        } else {
            return helpers.sendResponse(res, "error", 500, "Server error");
        }
    }
}

export const getTable = async (req, res) => {
    try {
        const tables = await getAllTables();
        return helpers.sendResponse(res, "success", 200, "Tables retrieved successfully.", tables);
    } catch (error) {
        console.error(error);
        return helpers.sendResponse(res, "error", 500, "Server error");
    }
}