const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: ['pending', 'preparing', 'done'], default: 'pending' }
  }],
  overallStatus: { type: String, enum: ['ongoing', 'done', 'closed'], default: 'ongoing' }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order