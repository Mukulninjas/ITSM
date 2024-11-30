const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    file: [{ type: String }],
    comments: [{
        text: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }],
    includedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const ticketModel = mongoose.model("Ticket", TicketSchema);

module.exports = ticketModel;
