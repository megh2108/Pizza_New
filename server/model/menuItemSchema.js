const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    ShopID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    ItemName: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    }
});

const MenuItem = mongoose.model('MENUITEM', menuItemSchema);

module.exports = MenuItem;
