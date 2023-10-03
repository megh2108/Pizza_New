const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const Shop = mongoose.model('SHOP', shopSchema);

module.exports = Shop;
