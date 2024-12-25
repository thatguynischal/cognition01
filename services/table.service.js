import Table from "../models/table.js";

export const createTable = async (name, capacity) => {

    if (!name) {
        throw {status: 422, message: 'Name is required'};
    }

    if (!capacity) {
        throw {status: 422, message: 'Capacity is required'};
    }

    const createdAt = new Date();
    const bookingStatus = false;
    const bookingDate = null;
    const bookedBy = null;

    const newTable =  await Table.create({
        tableName: name,
        capacity,
        createdAt,
        bookingStatus,
        bookingDate,
        bookedBy
    })

    return newTable;
}

export const getAllTables = async () => {
    return await Table.find();
}

export const deleteTable = async (tableId) => {
    const tableRecord = await Table.findOne({_id: tableId});
    if (!tableRecord) {
        throw {status: 400, message: 'No tables found'};
    }

    await Table.deleteOne({_id: tableId});
    return true;

}