const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name:String,
    price:Number,
    ingredients:[String],
    allergens:[String],
    course:{type:String,enum:['Starter','Main','Dessert'] ,default:'Starter'}
})

const MenuItem = mongoose.model('MenuItem',menuItemSchema);
module.exports = MenuItem;