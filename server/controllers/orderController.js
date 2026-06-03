const Order = require('../models/Order')

const createOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body

    if (!tableNumber || !items) {
      return res.status(400).json({ message: "Please provide tableNumber and items" })
    }

    if (isNaN(tableNumber)) {
      return res.status(400).json({ message: "Table number must be a number" })
    }

  
    const existingOrder = await Order.findOne({ 
      tableNumber, 
      overallStatus: { $in: ['pending', 'preparing'] } 
    })

    if (existingOrder) {
      
      existingOrder.items.push(...items)
      await existingOrder.save()
      return res.status(200).json({ message: "Items added to existing order", order: existingOrder })
    }

    
    const order = await Order.create({ tableNumber, items })
    return res.status(201).json({ message: "Order created successfully", order })

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem')
    return res.status(200).json({ orders })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    order.overallStatus = status  // ✅ correct field name
    await order.save()
    return res.status(200).json({ message: "Order status updated successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

const getOrdersByTableNumber = async (req, res) => {
  try {
    const { tableNumber } = req.params
    if (isNaN(tableNumber)) {
      return res.status(400).json({ message: "Table number must be a number" })
    }
    const orders = await Order.find({ tableNumber,overallStatus:{
      $in :['pending','preparing']
    } }).populate('items.menuItem') 
    return res.status(200).json({ orders })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

const updateItemStatus = async (req,res) => {
  try{
       const { orderId, itemId } = req.params
    const { status } = req.body

    const validStatuses = ['pending', 'preparing', 'done']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    const item = order.items.id(itemId)   // mongoose subdocument .id() helper
    if (!item) {
      return res.status(404).json({ message: "Item not found in order" })
    }

    item.status = status

    // Auto-update overallStatus based on all items
    const allStatuses = order.items.map(i => i.status)
    if (allStatuses.every(s => s === 'done')) {
      order.overallStatus = 'done'
    } else if (allStatuses.some(s => s === 'preparing' || s === 'done')) {
      order.overallStatus = 'preparing'
    } else {
      order.overallStatus = 'pending'
    }

    await order.save()
    return res.status(200).json({ message: "Item status updated", order })

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
   
}
const updateItemQuantity = async (req,res) =>{
  console.log("params:", req.params)  // ✅ add this
  console.log("body:", req.body) 
    try{
    const{orderId , itemId} = req.params
    const {quantity} = req.body

    if(!quantity || isNaN(quantity) || quantity < 1){
      return res.status(400).json({message:"Quantity must be a number >=1"})
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    const item = order.items.id(itemId)
    if (!item) {
      return res.status(404).json({ message: "Item not found in order" })
    }
    
    item.quantity=quantity
    await order.save()
    return res.status(200).json({message:"Item quantity updated",order})
   }catch(error){
     return res.Status(500).json({ message: "Internal server error" })
   }
    
}


module.exports = { createOrder, getAllOrders, updateOrderStatus, getOrdersByTableNumber, updateItemStatus,updateItemQuantity } 