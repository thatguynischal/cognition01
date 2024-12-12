import mongoose from "mongoose";
const UserVerificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    uniqueString: {
        type: String,
        unique: true,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

export default mongoose.model("UserVerification", UserVerificationSchema);
