const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    amount: {
        type: Number,
        required: true
    },
    term: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "PENDING",
        enum: ["PENDING", "APPROVED", "REJECTED"]
    },
    installments: [{
        amount: Number,
        dueDate: Date,
        status: {
            type: String,
            default: "PENDING",
            enum: ["PENDING", "PAID"]
        }
    }],
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    }
},{timestamps: true});

module.exports = mongoose.model("loan", loanSchema);