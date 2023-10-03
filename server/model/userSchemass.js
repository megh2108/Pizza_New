const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchemass = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    shopID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: function() {
            return this.type === 'admin'; // Secret key is required only for admins
        }
    },
    secretKey: {
        type: String,
        required: function() {
            return this.type === 'admin'; // Secret key is required only for admins
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchemass.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

// Generate token
userSchemass.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
};

const Userss = mongoose.model('USERSS', userSchemass);

module.exports = Userss;
