const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userss',
        required: true
    },
    shopID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('ORDER', orderSchema);

module.exports = Order;
