const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB,{
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
}).then(() => {
    console.log(`Connection Succesfull`);
}).catch((err) => { console.log(`No Connection.`)});