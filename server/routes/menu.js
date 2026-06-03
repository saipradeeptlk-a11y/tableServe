const router = require('express').Router();
const {getAllMenuItems,addMenuItem,updateMenuItem,deleteMenuItem} = require('../controllers/menuController');
const {loginMiddleware,rolechecker} = require('../middleware/authMiddleware');

router.get('/',loginMiddleware,getAllMenuItems);
router.post('/',loginMiddleware,rolechecker('admin'),addMenuItem);
router.put('/:id',loginMiddleware,rolechecker('admin'),updateMenuItem);
router.delete('/:id',loginMiddleware,rolechecker('admin'),deleteMenuItem);

module.exports = router;
