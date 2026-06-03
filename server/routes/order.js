const {createOrder, getAllOrders, updateOrderStatus, getOrdersByTableNumber,updateItemStatus,
updateItemQuantity} = require("../controllers/orderController");
const {loginMiddleware, rolechecker} = require("../middleware/authMiddleware");
const router = require('express').Router(); 

router.post('/',loginMiddleware,rolechecker('waiter'),createOrder);
router.get('/',loginMiddleware,rolechecker('kitchen'),getAllOrders);
router.put('/:id/status',loginMiddleware,rolechecker('waiter'),updateOrderStatus);
router.get('/table/:tableNumber',loginMiddleware,rolechecker('waiter'),getOrdersByTableNumber);
router.put('/:orderId/items/:itemId/status',loginMiddleware,rolechecker('kitchen'),updateItemStatus);
router.put('/:orderId/items/:itemId/quantity', loginMiddleware,rolechecker('waiter'), updateItemQuantity)

module.exports = router;

