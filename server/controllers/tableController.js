const Table = require('../models/Table')

const createTable = async (req, res) => {
    try {
        const { TableNumber, Status } = req.body
        if (!TableNumber || !Status) {
            return res.status(400).json({ message: 'pls provide all the nessary fields' })

        }
        await Table.create({
            TableNumber, Status
        })
        return res.status(200).json({ message: "Successfully created the table" })
    } catch {
        return res.status(500).json({
            message: err.message
        })
    }
}



const updateStatus = async (req, res) => {
    try {
        const { Status } = req.body
        const { id } = req.params

        const t = await Table.findById(id)
        t.Status = Status
        await t.save()
        return res.status(200).json({ message: "Successfully updates the status " })
    } catch {
        return res.status(404).json({
            message: err.message
        })
    }
}

const getAllTables = async (req, res) => {
    try {
        const t = await Table.find()
        return res.status(200).json({
            t
        })
    } catch {
        return res.status(404).json({
            message: err.message
        })
    }
}

module.exports = {
    createTable,
    updateStatus,
    getAllTables

}