const express = require('express')
const router = express.Router()
const { setupAdmin, checkSetup } = require('../controllers/setupController')

router.get('/check', checkSetup)
router.post('/', setupAdmin)

module.exports = router