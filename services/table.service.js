import Table from "../models/table.js";
import Bookings from "../models/tableBooking.js";

export const createTable = async (name, capacity) => {

    if (!name) {
        throw {status: 422, message: 'Name is required'};
    }

    if (!capacity) {
        throw {status: 422, message: 'Capacity is required'};
    }

    const existingTable = await Table.exists({ tableName: name });

    if (existingTable) {
        throw { status: 409, message: 'Table name already exists' }; // Conflict status
    }

    const newTable =  await Table.create({
        tableName: name,
        capacity,
        createdAt : new Date() ,
        occupancy : 'available',
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

export const updateTable = async (tableId, name, capacity) => {
    if (!tableId) {
        throw {status: 422, message: 'Id is required'};
    }
    await Table.findByIdAndUpdate(tableId, {tableName: name}, {capacity: capacity});

}

export const newCustomer = async (tableId) => {
    if (!tableId ) {
        throw {status: 422, message: 'Please enter all the required fields.'};
    }
    await Table.findByIdAndUpdate(tableId, {occupancy: 'occupied'});

    return true;
};
export const createBooking = async (tableId, bookedBy, contactInfo, bookingDate) => {
    if (!tableId && !bookedBy && !contactInfo && !bookingDate) {
        throw {status: 422, message: 'Please enter all the required fields.'};
    }
    const newBooking = new Bookings({
        tableId,
        bookedBy,
        contactInfo,
        bookingDate,
    });
    await newBooking.save();
    await Table.findByIdAndUpdate(tableId, {occupancy: 'booked'});

    return newBooking;
};
