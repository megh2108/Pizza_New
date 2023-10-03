const mongoose = require('mongoose');


const pizzaSchema = new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    varients:[
        {
              type: String,
              required: true
            
        }
    ],
    prices:[
        {
            small: {
                
              type: Number,
              required: true
            },
            medium: {
                
              type: Number,
              required: true
            },
            large: {
                
              type: Number,
              required: true
            }
        }
    ],
    category:{
        type: String,
        require:true
    },
    description:{
        type: String,
        require:true
    }
   

})


const Pizza = mongoose.model('PIZZA',pizzaSchema);

module.exports = Pizza;