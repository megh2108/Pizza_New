const mongoose = require('mongoose');

const orderDetailsSchema = new mongoose.Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'PizzaMenuItem',
                required: true
            },
            itemName: {
                type: String,
                required: true
            },
            size: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

const OrderDetail = mongoose.model('ORDERDETAIL', orderDetailsSchema);

module.exports = OrderDetail;
