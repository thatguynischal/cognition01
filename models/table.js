import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
    tableName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    bookingStatus: {
        type: String,
    },
    bookingDate: {
        type: Date,
    },
    bookedBy: {
        type: String,
    },
    capacity: {
        type: Number,
        required: true,
    }
})

export default mongoose.model('Table', TableSchema);