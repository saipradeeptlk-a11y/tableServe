const MenuItem = require('../models/MenuItem')
const getAllMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find();
        return res.status(200).json({
            items
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }

}
const addMenuItem = async (req, res) => {
    try {
        const { name, price, course, ingredients, allergens } = req.body;
        if (!name || !price || !course || !ingredients || !allergens) {
            return res.status(400).json({
                message: "pls provide all the fields"
            })
        }
        const TrimedName = name.trim();
        if (isNaN(price)) {
            return res.status(400).json({ error: "Price must be a number" })
        }
        await MenuItem.create({
            name: TrimedName,
            price,
            course,
            ingredients,
            allergens
        })
        return res.status(201).json({ message: "Menu item added successfully" })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, course, ingredients, allergens } = req.body;
        if (!name || !price || !course || !ingredients || !allergens) {
            return res.status(400).json({ message: "pls provide all the fields" })
        }
        const TrimedName = name.trim();
        if (isNaN(price)) {
            return res.status(400).json({ error: "Price must be a number" })
        }
        const item = await MenuItem.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Menu item not found" })
        }
        item.name = TrimedName;
        item.price = price;
        item.course = course;
        item.ingredients = ingredients;
        item.allergens = allergens;
        await item.save();
        return res.status(200).json({ message: "Menu item updated successfully" })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }


}
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item1 = await MenuItem.findById(id);
        if (!item1) {
            return res.status(404).json({ message: "Menu item not found" })
        }
        const item = await MenuItem.findByIdAndDelete(id);
        return res.status(200).json({ message: "Menu item deleted successfully" })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}
module.exports = {
    getAllMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
}