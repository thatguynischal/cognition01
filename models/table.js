import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
    tableName: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    capacity: {
        type: Number,
        required: true,
    },
    occupancy: {
        type: String,
        enum: ['available', 'booked', 'occupied'],
        default: 'available',
    }
});

export default mongoose.model('Table', TableSchema);
