const mongoose = require('mongoose')

const TableSchema = new mongoose.Schema({
    TableNumber: { type: Number, required: true },
    Status: { type: String, enum: ['available', 'occupied', 'closed'], default: 'available' }
}, { timestamps: true })

const Table = mongoose.model('Table', TableSchema)
module.exports = Table