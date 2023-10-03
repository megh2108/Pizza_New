const mongoose = require('mongoose');

const topingSchema = new mongoose.Schema({
    toppingName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Toping = mongoose.model('TOPPING', topingSchema);

module.exports = Toping;
