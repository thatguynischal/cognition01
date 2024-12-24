import Table from "../models/table.js";

export const createTable = async (name) => {
    const createdAt = new Date();
    const bookingStatus = false;
    const bookingDate = null;
    const bookedBy = null;

    const newTable =  await Table.create({
        tableName: name,
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