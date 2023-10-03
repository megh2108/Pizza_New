const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

const Payment = mongoose.model('PAYMENT', paymentSchema);

module.exports = Payment;
