const express = require('express')
const router = express.Router()
const { askAI } = require('../controllers/aiController')
const { loginMiddleware } = require('../middleware/authMiddleware')

router.post('/ask', loginMiddleware, askAI)

module.exports = router