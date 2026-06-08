const express = require('express');
const router = express.Router();
const { registerController, loginController, getAllUsers } = require('../controllers/authController');

const { loginMiddleware, rolechecker } = require('../middleware/authMiddleware');
router.get('/', loginMiddleware, rolechecker('admin'), getAllUsers)
router.post('/register', loginMiddleware, rolechecker('admin'), registerController);
router.post('/login', loginController);

module.exports = router;
