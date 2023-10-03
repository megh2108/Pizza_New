const mongoose = require('mongoose');

const user1Schema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    UserType: {
        type: String,
        enum: ['Admin', 'Customer'],
        required: true
    },
    ShopID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }
});

const User1 = mongoose.model('User1', user1Schema);

module.exports = User1;
