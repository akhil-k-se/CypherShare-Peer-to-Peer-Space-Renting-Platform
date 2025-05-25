const mongoose = require('mongoose');

const dbConnect = async() => {
    try{
        await mongoose.connect('mongodb+srv://akhilse2024:hotlineclasher123@cluster0.cigonb3.mongodb.net/CypherShare?retryWrites=true&w=majority&appName=Cluster0');
        console.log("Db Connected");
    }
    catch(e){
        console.log("An Error Occured in DB");
        console.log(e);    
    }
}

module.exports = {dbConnect};