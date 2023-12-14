    const mongoose = require('mongoose');

    const offerSchema = new mongoose.Schema({
        shopID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop',
            required: true
        },
        offerName: {
            type: String,
            required: true
        },
        discountPercentage: {
            type: Number,
            required: true
        },
        // startDate: {
        //     type: Date,
        //     required: true
        // },
        // endDate: {
        //     type: Date,
        //     required: true
        // },  
        isActive: {
            type: Boolean,
            default: false,
        }
    });

    const Offer = mongoose.model('OFFER', offerSchema);

    module.exports = Offer;
