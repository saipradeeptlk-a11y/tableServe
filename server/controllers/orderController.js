const Order = require('../models/Order')
const Table = require('../models/Table')

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
      overallStatus: 'ongoing'
    })

    if (existingOrder) {

      existingOrder.items.push(...items)
      await existingOrder.save()
      return res.status(200).json({ message: "Items added to existing order", order: existingOrder })
    }


    const order = await Order.create({ tableNumber, items })
    await Table.findOneAndUpdate(
      { TableNumber: tableNumber },
      { Status: 'occupied' }
    )
    req.io.emit('newOrder', order)
    return res.status(201).json({ message: "Order created successfully", order })

  } catch (error) {
    console.log("createOrder error:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

const getOngoingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ overallStatus: 'ongoing' }).populate('items.menuItem')
    return res.status(200).json({ orders })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem');
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

    const allStatuses = order.items.map(i => i.status)
    if (allStatuses.every(s => s === 'done')) {
      order.overallStatus = status
      await order.save()
      await Table.findOneAndUpdate(
        { TableNumber: order.tableNumber },
        { Status: 'available' }
      )
      req.io.emit('orderClosed', order)
      return res.status(200).json({ message: "Order status updated successfully" })
    } else {
      return res.status(400).json({ error: "error" })
    }


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
    const orders = await Order.find({
      tableNumber, overallStatus: {
        $in: ['ongoing']
      }
    }).populate('items.menuItem')
    return res.status(200).json({ orders })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

const updateItemStatus = async (req, res) => {
  try {
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
    await order.save()
    await order.populate('items.menuItem')

    const allStarters = order.items.filter(i => i.menuItem.course === "Starter")
    const allMains = order.items.filter(i => i.menuItem.course === "Main")
    const allDesserts = order.items.filter(i => i.menuItem.course === "Dessert")



    if (allStarters.length > 0 && allStarters.every(s => s.status === "done")) {
      req.io.emit('courseReady', { tableNumber: order.tableNumber, course: "Starter" })
    }
    if (allMains.length > 0 && allMains.every(s => s.status === "done")) {

      req.io.emit('courseReady', { tableNumber: order.tableNumber, course: "Main" })
    }
    if (allDesserts.length > 0 && allDesserts.every(s => s.status === "done")) {
      req.io.emit('courseReady', { tableNumber: order.tableNumber, course: "Dessert" })
    }






    await order.save()
    req.io.emit('orderUpdated', order)
    return res.status(200).json({ message: "Item status updated", order })

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }

}
const updateItemQuantity = async (req, res) => {

  try {
    const { orderId, itemId } = req.params
    const { quantity } = req.body

    if (!quantity || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a number >=1" })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    const item = order.items.id(itemId)
    if (!item) {
      return res.status(404).json({ message: "Item not found in order" })
    }

    item.quantity = quantity
    await order.save()
    return res.status(200).json({ message: "Item quantity updated", order })
  } catch (error) {
    return res.Status(500).json({ message: "Internal server error" })
  }

}

const getActiveOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      overallStatus: { $in: ['ongoing', 'done'] }
    }).populate('items.menuItem')
    return res.status(200).json({ orders })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}


module.exports = { createOrder, getOngoingOrders, updateOrderStatus, getOrdersByTableNumber, updateItemStatus, updateItemQuantity, getAllOrders, getActiveOrders } 