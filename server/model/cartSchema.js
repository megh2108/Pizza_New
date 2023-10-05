const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PizzaMenuItem',
        required: true
    },
    itemName: {
        type: String,
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    items: [cartItemSchema]
});

const Cart = mongoose.model('CARTO', cartSchema);

module.exports = Cart;


