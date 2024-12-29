import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true,
    },
    bookedBy: {
        type: String,
        required: true,
    },
    contactInfo: {
        type: String,
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed'],
        default: 'confirmed',
    },
});

export default mongoose.model('Booking', BookingSchema);
