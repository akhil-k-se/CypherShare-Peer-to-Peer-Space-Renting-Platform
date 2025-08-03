const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

const dbConnect = async() => {
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Db Connected");
    }
    catch(e){
        console.log("An Error Occured in DB");
        console.log(e);    
    }
}

module.exports = {dbConnect};