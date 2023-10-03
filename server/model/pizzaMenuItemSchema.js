const mongoose = require('mongoose');

const pizzaMenuItemSchema = new mongoose.Schema({
    shopID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sizes: {
        small: {
            price: {
                type: Number,
                required: true
            }
        },
        medium: {
            price: {
                type: Number,
                required: true
            }
        },
        large: {
            price: {
                type: Number,
                required: true
            }
        }
    },
    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        }
    ]
});

const PizzaMenuItem = mongoose.model('PIZZAMENUITEM', pizzaMenuItemSchema);

module.exports = PizzaMenuItem;

// const mongoose = require('mongoose');

// const pizzaMenuItemSchema = new mongoose.Schema({
//     shopID: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Shop',
//         required: true
//     },
//     itemName: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     sizes: {
//         small: {
//             price: {
//                 type: Number,
//                 required: true
//             }
//         },
//         medium: {
//             price: {
//                 type: Number,
//                 required: true
//             }
//         },
//         large: {
//             price: {
//                 type: Number,
//                 required: true
//             }
//         }
//     },
//     ingredients: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Ingredient'
//         }
//     ]
// });

// const PizzaMenuItem = mongoose.model('PIZZAMENUITEM', pizzaMenuItemSchema);

// module.exports = PizzaMenuItem;
