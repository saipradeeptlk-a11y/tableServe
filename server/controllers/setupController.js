const User = require('../models/User')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const setupAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' })
        }

        // ✅ Check if any admin already exists
        const adminExists = await User.findOne({ role: 'admin' })
        if (adminExists) {
            return res.status(403).json({ message: 'Setup already complete' })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email' })
        }

        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/.test(password))) {
            return res.status(400).json({ message: 'Password must be 8+ chars with uppercase, lowercase, number and special character' })
        }

        const hashed = await bcrypt.hash(password, 10)
        await User.create({ name, email, password: hashed, role: 'admin' })

        return res.status(201).json({ message: 'Admin account created successfully! Please login.' })

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

const checkSetup = async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: 'admin' })
        return res.status(200).json({ setupComplete: !!adminExists })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = { setupAdmin, checkSetup }