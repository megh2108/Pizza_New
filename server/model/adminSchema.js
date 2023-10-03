const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const adminSchema = new mongoose.Schema({
    
    email:{
        type: String,
        require:true
    },
    password:{
        type: String,
        require:true
    },
    cpassword:{
        type: String,
        require:true
    },
    shopID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    tokens:[
        {
            token: {
                
              type: String,
              required: true
            }
        }
    ]

})

adminSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
});

// genereate token
adminSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;

    }catch(err){
        console.log(err);
    }
}

const Admin = mongoose.model('ADMIN',adminSchema);

module.exports = Admin;