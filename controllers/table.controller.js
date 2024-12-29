import {createTable, deleteTable, getAllTables, updateTable} from '../services/table.service.js';
import helpers from '../utils/helpers.js';

export const newTableController = async (req, res) => {
    try {
        const {name, capacity} = req.body;
        await createTable(name, capacity);
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

export const getTableController = async (req, res) => {
    try {
        const tables = await getAllTables();
        return helpers.sendResponse(res, "success", 200, "Tables retrieved successfully.", tables);
    } catch (error) {
        console.error(error);
        return helpers.sendResponse(res, "error", 500, "Server error");
    }
}

export const deleteTableController = async (req, res) => {
    try {
        await deleteTable(req.body.tableId);
        return helpers.sendResponse(res, "success", 200, "Table deleted successfully.");
    } catch (error) {
        console.error(error);
        return helpers.sendResponse(res, "error", 500, "Server error");
    }
}

export const updateTableController = async (req, res) => {
    const {tableId, name, capacity} = req.body;

    try {
        await updateTable(tableId, name, capacity)
        return helpers.sendResponse(res, "success", 200, "Table updated successfully.");
    } catch (error) {
        console.error(error);
        return helpers.sendResponse(res, "error", 500, "Server error");
    }
}