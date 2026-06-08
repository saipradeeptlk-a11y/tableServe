const express = require('express');
const router = express.Router();
const { loginMiddleware, rolechecker } = require("../middleware/authMiddleware");
const { createTable, updateStatus, getAllTables } = require('../controllers/tableController')

router.post("/", loginMiddleware, rolechecker("admin"), createTable)
router.get("/", loginMiddleware, rolechecker("admin"), getAllTables)
router.put("/:id", loginMiddleware, rolechecker("admin"), updateStatus)

module.exports = router;